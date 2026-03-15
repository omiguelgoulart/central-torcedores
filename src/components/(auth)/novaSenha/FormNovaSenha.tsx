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
    confirmarSenha: z.string(),
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
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const novaSenha = watch("novaSenha");
  const status = useMemo(() => regrasSenhaStatus(novaSenha ?? ""), [novaSenha]);
  const checklist = [
    { ok: status.temMin, label: "Mínimo de 8 caracteres" },
    { ok: status.temMinusc, label: "1 letra minúscula" },
    { ok: status.temMaiusc, label: "1 letra maiúscula" },
    { ok: status.temNumero, label: "1 número" },
    { ok: status.temSimbolo, label: "1 símbolo" },
  ];

  async function onSubmit(data: FormData) {
    const errosValidacao = validaSenha(data.novaSenha);
    if (errosValidacao.length > 0) {
      setError("novaSenha", {
        message: errosValidacao[0].replace("Erro... ", ""),
      });
      return;
    }

    if (!token) {
      toast.error("Token de recuperação não encontrado.");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/redefinir-senha`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha: data.novaSenha }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = body?.error ?? "Erro ao redefinir senha. Tente novamente.";
        toast.error(msg);
        return;
      }

      setSucesso(true);
      toast.success("Senha redefinida com sucesso!");

      const email = body?.email;
      if (email) {
        const logou = await loginSilencioso(email, data.novaSenha);
        if (logou) {
          router.push("/");
          return;
        }
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-destructive">
          Link inválido. O token de recuperação não foi encontrado na URL.
        </p>
        <Button variant="outline" onClick={() => router.push("/recuperaSenha")}>
          Solicitar novo link
        </Button>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
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
      <div className="">
        <Input
          id="novaSenha"
          type="password"
          placeholder="Digite sua nova senha"
          className="w-full"
          {...register("novaSenha")}
        />
        {errors.novaSenha && (
          <p className="text-sm text-destructive mt-1">
            {errors.novaSenha.message}
          </p>
        )}

          {novaSenha && (
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
          <p className="text-sm text-destructive mt-1">
            {errors.confirmarSenha.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Redefinindo...
          </>
        ) : (
          "Redefinir senha"
        )}
      </Button>
    </form>
  );
}
