"use client";

import { useForm, Controller, FieldError } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { regrasSenhaStatus, validaSenha } from "@/lib/validaSenha";
import { UF } from "@/lib/uf";
import { useAuth } from "@/hooks/useAuth";

export type UFType = (typeof UF)[number];

const schema = z
  .object({
    nome: z.string().min(2, "Informe seu nome"),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(1, "Senha obrigatória"),
    confirmarSenha: z.string().min(1, "Confirmação obrigatória"),

    telefone: z.string().min(10, "Celular/telefone inválido"),
    cpf: z.string().min(11, "Informe CPF"),

    enderecoCEP: z.string().min(8, "CEP inválido"),
    enderecoLogradouro: z.string().min(3, "Endereço obrigatório"),
    enderecoNumero: z.string().min(1, "Número obrigatório"),
    enderecoBairro: z.string().min(2, "Bairro obrigatório"),
    enderecoCidade: z.string().min(2, "Cidade obrigatória"),
    enderecoUF: z.enum(UF),
  })
  .superRefine((data, ctx) => {
    const erros = validaSenha(data.senha);

    if (erros.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: erros[0],
        path: ["senha"],
      });
    }

    if (data.senha !== data.confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não conferem",
        path: ["confirmarSenha"],
      });
    }
  });

export type RegisterFormData = z.infer<typeof schema>;

const onlyDigits = (value: string) => value.replace(/\D+/g, "");

type SectionTitleProps = {
  title: string;
  description?: string;
};

function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

type ErrorMessageProps = {
  error?: FieldError;
};

function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error?.message) return null;

  return <p className="text-sm text-red-500">{error.message}</p>;
}

export function FormCadastro() {
  const router = useRouter();
  const { loginSilencioso } = useAuth();

  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      telefone: "",
      cpf: "",
      enderecoCEP: "",
      enderecoLogradouro: "",
      enderecoNumero: "",
      enderecoBairro: "",
      enderecoCidade: "",
    },
  });

  const senha = watch("senha") ?? "";
  const cep = watch("enderecoCEP") ?? "";

  const status = useMemo(() => regrasSenhaStatus(senha), [senha]);

  const checklist = [
    { ok: status.temMin, label: "Mínimo de 8 caracteres" },
    { ok: status.temMinusc, label: "1 letra minúscula" },
    { ok: status.temMaiusc, label: "1 letra maiúscula" },
    { ok: status.temNumero, label: "1 número" },
    { ok: status.temSimbolo, label: "1 símbolo" },
  ];

  async function buscarCep() {
    const cepLimpo = onlyDigits(cep);

    if (cepLimpo.length !== 8) {
      toast.error("CEP deve ter 8 dígitos");
      return;
    }

    setBuscandoCep(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );
      const data: {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      } = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setValue("enderecoLogradouro", data.logradouro || "", {
        shouldValidate: true,
      });
      setValue("enderecoBairro", data.bairro || "", {
        shouldValidate: true,
      });
      setValue("enderecoCidade", data.localidade || "", {
        shouldValidate: true,
      });

      if (data.uf && UF.includes(data.uf as UFType)) {
        setValue("enderecoUF", data.uf as UFType, {
          shouldValidate: true,
        });
      }

      toast.success("Endereço preenchido!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar CEP");
    } finally {
      setBuscandoCep(false);
    }
  }

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);

    try {
      const { confirmarSenha: _, ...rest } = data;

      const payload = {
        ...rest,
        telefone: onlyDigits(rest.telefone),
        cpf: onlyDigits(rest.cpf),
        enderecoCEP: onlyDigits(rest.enderecoCEP),
        origemCadastro: "web",
        aceitaTermosEm: new Date().toISOString(),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuario`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const body: {
        message?: string;
        error?: string;
        errors?: Array<{ message?: string }>;
      } | null = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body?.message ||
          body?.error ||
          (Array.isArray(body?.errors) ? body.errors[0]?.message : null) ||
          "Erro ao cadastrar";

        toast.error(message);
        return;
      }

      toast.success("Cadastro realizado!");

      const logou = await loginSilencioso(data.email, data.senha);
      router.push(logou ? "/" : "/login");
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  const telefoneRegister = register("telefone");
  const cpfRegister = register("cpf");
  const cepRegister = register("enderecoCEP");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <SectionTitle title="Dados pessoais" />

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              {...register("nome")}
              placeholder="Ex.: João da Silva"
              disabled={loading}
            />
            <ErrorMessage error={errors.nome} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="email@exemplo.com"
              disabled={loading}
            />
            <ErrorMessage error={errors.email} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="telefone">Telefone / Celular</Label>
              <Input
                id="telefone"
                {...telefoneRegister}
                placeholder="DDD + número"
                maxLength={11}
                disabled={loading}
                onChange={(event) => {
                  event.target.value = onlyDigits(event.target.value);
                  telefoneRegister.onChange(event);
                }}
              />
              <ErrorMessage error={errors.telefone} />
            </div>

            <div className="space-y-3">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                {...cpfRegister}
                placeholder="Somente números"
                maxLength={11}
                disabled={loading}
                onChange={(event) => {
                  event.target.value = onlyDigits(event.target.value);
                  cpfRegister.onChange(event);
                }}
              />
              <ErrorMessage error={errors.cpf} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              {...register("senha")}
              placeholder="Crie uma senha forte"
              disabled={loading}
            />
            <ErrorMessage error={errors.senha} />

            {senha ? (
              <ul className="mt-2 space-y-1 text-xs">
                {checklist.map((item) => (
                  <li
                    key={item.label}
                    className={
                      item.ok ? "text-green-600" : "text-muted-foreground"
                    }
                  >
                    {item.ok ? "✓" : "•"} {item.label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmarSenha">Confirmar senha</Label>
            <Input
              id="confirmarSenha"
              type="password"
              {...register("confirmarSenha")}
              placeholder="Digite novamente sua senha"
              disabled={loading}
            />
            <ErrorMessage error={errors.confirmarSenha} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle title="Endereço" />

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label htmlFor="enderecoCEP">CEP</Label>
            <div className="flex gap-2">
              <Input
                id="enderecoCEP"
                {...cepRegister}
                placeholder="Somente números"
                maxLength={8}
                disabled={loading || buscandoCep}
                onChange={(event) => {
                  event.target.value = onlyDigits(event.target.value);
                  cepRegister.onChange(event);
                }}
              />
              <Button
                type="button"
                onClick={buscarCep}
                disabled={buscandoCep || loading}
                variant="outline"
              >
                {buscandoCep ? "Buscando..." : "Buscar"}
              </Button>
            </div>
            <ErrorMessage error={errors.enderecoCEP} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-3 md:col-span-3">
              <Label htmlFor="enderecoLogradouro">Endereço</Label>
              <Input
                id="enderecoLogradouro"
                {...register("enderecoLogradouro")}
                placeholder="Rua, avenida, alameda..."
                disabled={loading}
              />
              <ErrorMessage error={errors.enderecoLogradouro} />
            </div>

            <div className="space-y-3">
              <Label htmlFor="enderecoNumero">Número</Label>
              <Input
                id="enderecoNumero"
                {...register("enderecoNumero")}
                placeholder="Nº"
                disabled={loading}
              />
              <ErrorMessage error={errors.enderecoNumero} />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="enderecoBairro">Bairro</Label>
            <Input
              id="enderecoBairro"
              {...register("enderecoBairro")}
              disabled={loading}
            />
            <ErrorMessage error={errors.enderecoBairro} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="enderecoCidade">Cidade</Label>
              <Input
                id="enderecoCidade"
                {...register("enderecoCidade")}
                disabled={loading}
              />
              <ErrorMessage error={errors.enderecoCidade} />
            </div>

            <div className="space-y-3">
              <Label htmlFor="enderecoUF">UF</Label>
              <Controller
                name="enderecoUF"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger id="enderecoUF">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {UF.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage error={errors.enderecoUF} />
            </div>
          </div>
        </div>
      </section>

      <Button type="submit" disabled={loading || !isValid} className="w-full">
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
