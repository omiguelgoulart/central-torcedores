"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";
import { validaSenha, regrasSenhaStatus } from "@/lib/validaSenha";
import { useAuth } from "@/hooks/useAuth";

const API = process.env.NEXT_PUBLIC_API_URL;

const schema = z
  .object({
    novaSenha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type FormData = z.infer<typeof schema>;

export function FormRedefinirSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [sucesso, setSucesso] = useState(false);
  const { loginSilencioso } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      novaSenha: "",
      confirmarSenha: "",
    },
  });

  const novaSenha = watch("novaSenha");

  const status = useMemo(() => {
    return regrasSenhaStatus(novaSenha ?? "");
  }, [novaSenha]);

  const checklist = [
    { ok: status.temMin, label: "Mínimo de 8 caracteres" },
    { ok: status.temMinusc, label: "1 letra minúscula" },
    { ok: status.temMaiusc, label: "1 letra maiúscula" },
    { ok: status.temNumero, label: "1 número" },
    { ok: status.temSimbolo, label: "1 símbolo" },
  ];

  async function onSubmit(data: FormData) {
    if (!token) {
      toast.error("Token de recuperação não encontrado.");
      return;
    }

    const errosValidacao = validaSenha(data.novaSenha);
    if (errosValidacao.length > 0) {
      setError("novaSenha", {
        type: "manual",
        message: errosValidacao[0].replace("Erro... ", ""),
      });
      return;
    }

    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          novaSenha: data.novaSenha,
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          body?.error ??
          body?.message ??
          "Erro ao redefinir senha. Tente novamente.";

        toast.error(msg);
        return;
      }

      setSucesso(true);
      toast.success(body?.message ?? "Senha redefinida com sucesso!");

      const email = body?.email;
      if (email) {
        const logou = await loginSilencioso(email, data.novaSenha);
        if (logou) {
          router.replace("/");
          return;
        }
      }

      setTimeout(() => {
        router.replace("/login");
      }, 1200);
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-destructive">
          Link inválido. O token de recuperação não foi encontrado na URL.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/recuperaSenha")}
        >
          Solicitar novo link
        </Button>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="space-y-4 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <p className="text-muted-foreground">
          Sua senha foi redefinida com sucesso!
        </p>

        <Button className="w-full" onClick={() => router.push("/login")}>
          Ir para o login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          id="novaSenha"
          type="password"
          placeholder="Digite sua nova senha"
          className="w-full"
          {...register("novaSenha")}
        />

        {errors.novaSenha && (
          <p className="mt-1 text-sm text-destructive">
            {errors.novaSenha.message}
          </p>
        )}

        {novaSenha && (
          <ul className="mt-2 space-y-1 text-xs">
            {checklist.map((item) => (
              <li
                key={item.label}
                className={item.ok ? "text-green-600" : "text-muted-foreground"}
              >
                {item.ok ? "✓" : "•"} {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Input
          id="confirmarSenha"
          type="password"
          placeholder="Confirme sua nova senha"
          className="w-full"
          {...register("confirmarSenha")}
        />

        {errors.confirmarSenha && (
          <p className="mt-1 text-sm text-destructive">
            {errors.confirmarSenha.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redefinindo...
          </>
        ) : (
          "Redefinir senha"
        )}
      </Button>
    </form>
  );
}