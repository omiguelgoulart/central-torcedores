"use client";

import { useForm, Controller } from "react-hook-form";
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

const onlyDigits = (v: string) => v.replace(/\D+/g, "");

export function FormCadastro() {
  const router = useRouter();
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
  });

  const senha = watch("senha");
  const cep = watch("enderecoCEP") ?? "";

  const status = useMemo(() => regrasSenhaStatus(senha ?? ""), [senha]);
  const checklist = [
    { ok: status.temMin, label: "Mínimo de 8 caracteres" },
    { ok: status.temMinusc, label: "1 letra minúscula" },
    { ok: status.temMaiusc, label: "1 letra maiúscula" },
    { ok: status.temNumero, label: "1 número" },
    { ok: status.temSimbolo, label: "1 símbolo" },
  ];

  async function buscarCep() {
    const c = onlyDigits(cep);
    if (c.length !== 8) {
      toast.error("CEP deve ter 8 dígitos");
      return;
    }

    setBuscandoCep(true);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${c}/json/`);
      const data = await res.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setValue("enderecoLogradouro", data.logradouro || "");
      setValue("enderecoBairro", data.bairro || "");
      setValue("enderecoCidade", data.localidade || "");

      if (UF.includes(data.uf)) {
        setValue("enderecoUF", data.uf as UFType);
      }

      toast.success("Endereço preenchido!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao buscar CEP");
    } finally {
      setBuscandoCep(false);
    }
  }

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);

    try {
      const { confirmarSenha, ...rest } = data;

      const payload = {
        ...rest,
        telefone: onlyDigits(rest.telefone),
        cpf: onlyDigits(rest.cpf),
        enderecoCEP: onlyDigits(rest.enderecoCEP),
        origemCadastro: "web",
        aceitaTermosEm: new Date().toISOString(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          body?.message ||
          body?.error ||
          (Array.isArray(body?.errors) ? body.errors[0]?.message : null) ||
          "Erro ao cadastrar";

        toast.error(msg);
        return;
      }

      toast.success("Cadastro realizado!");
      router.push("/login");
    } catch (e) {
      console.error(e);
      toast.error("Erro inesperado ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  // registers separados para poder usar o onChange correto
  const telefoneRegister = register("telefone");
  const cpfRegister = register("cpf");
  const cepRegister = register("enderecoCEP");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* NOME */}
      <div className="space-y-1">
        <Label>Nome completo</Label>
        <Input
          {...register("nome")}
          placeholder="Ex.: João da Silva"
          disabled={loading}
        />
        {errors.nome && (
          <p className="text-red-500 text-sm">{errors.nome.message}</p>
        )}
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <Label>E-mail</Label>
        <Input
          {...register("email")}
          placeholder="email@exemplo.com"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* SENHA */}
      <div className="space-y-1">
        <Label>Senha</Label>
        <Input
          type="password"
          {...register("senha")}
          placeholder="Crie uma senha forte"
          disabled={loading}
        />
        {errors.senha && (
          <p className="text-red-500 text-sm">{errors.senha.message}</p>
        )}

        <ul className="text-xs space-y-1 mt-1">
          {checklist.map((c) => (
            <li
              key={c.label}
              className={c.ok ? "text-green-600" : "text-muted-foreground"}
            >
              {c.ok ? "✓" : "•"} {c.label}
            </li>
          ))}
        </ul>
      </div>

      {/* CONFIRMAR SENHA */}
      <div className="space-y-1">
        <Label>Confirmar senha</Label>
        <Input
          type="password"
          {...register("confirmarSenha")}
          disabled={loading}
        />
        {errors.confirmarSenha && (
          <p className="text-red-500 text-sm">
            {errors.confirmarSenha.message}
          </p>
        )}
      </div>

      {/* TELEFONE */}
      <div className="space-y-1">
        <Label>Telefone / Celular</Label>
        <Input
          {...telefoneRegister}
          placeholder="DDD + número"
          maxLength={11}
          disabled={loading}
          onChange={(e) => {
            e.target.value = onlyDigits(e.target.value);
            telefoneRegister.onChange(e);
          }}
        />
        {errors.telefone && (
          <p className="text-red-500 text-sm">
            {errors.telefone.message}
          </p>
        )}
      </div>

      {/* CPF */}
      <div className="space-y-1">
        <Label>CPF</Label>
        <Input
          {...cpfRegister}
          placeholder="Somente números"
          maxLength={11}
          disabled={loading}
          onChange={(e) => {
            e.target.value = onlyDigits(e.target.value);
            cpfRegister.onChange(e);
          }}
        />
        {errors.cpf && (
          <p className="text-red-500 text-sm">{errors.cpf.message}</p>
        )}
      </div>

      {/* CEP */}
      <div className="space-y-1">
        <Label>CEP</Label>
        <div className="flex gap-2">
          <Input
            {...cepRegister}
            placeholder="Somente números"
            maxLength={8}
            disabled={loading || buscandoCep}
            onChange={(e) => {
              e.target.value = onlyDigits(e.target.value);
              cepRegister.onChange(e);
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
        {errors.enderecoCEP && (
          <p className="text-red-500 text-sm">
            {errors.enderecoCEP.message}
          </p>
        )}
      </div>

      {/* LOGRADOURO */}
      <div className="space-y-1">
        <Label>Endereço</Label>
        <Input {...register("enderecoLogradouro")} disabled={loading} />
        {errors.enderecoLogradouro && (
          <p className="text-red-500 text-sm">
            {errors.enderecoLogradouro.message}
          </p>
        )}
      </div>

      {/* NÚMERO */}
      <div className="space-y-1">
        <Label>Número</Label>
        <Input {...register("enderecoNumero")} disabled={loading} />
        {errors.enderecoNumero && (
          <p className="text-red-500 text-sm">
            {errors.enderecoNumero.message}
          </p>
        )}
      </div>

      {/* BAIRRO */}
      <div className="space-y-1">
        <Label>Bairro</Label>
        <Input {...register("enderecoBairro")} disabled={loading} />
        {errors.enderecoBairro && (
          <p className="text-red-500 text-sm">
            {errors.enderecoBairro.message}
          </p>
        )}
      </div>

      {/* CIDADE */}
      <div className="space-y-1">
        <Label>Cidade</Label>
        <Input {...register("enderecoCidade")} disabled={loading} />
        {errors.enderecoCidade && (
          <p className="text-red-500 text-sm">
            {errors.enderecoCidade.message}
          </p>
        )}
      </div>

      {/* UF */}
      <div className="space-y-1">
        <Label>UF</Label>
        <Controller
          name="enderecoUF"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loading}
            >
              <SelectTrigger>
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
        {errors.enderecoUF && (
          <p className="text-red-500 text-sm">
            {errors.enderecoUF.message}
          </p>
        )}
      </div>

      {/* BOTÃO */}
      <Button disabled={loading || !isValid} className="w-full">
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
