"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

interface AdminLoginForm {
  email: string;
  senha: string;
}

type AdminRoleApi = "SUPER_ADMIN" | "OPERACIONAL" | "PORTARIA" | string;

type AdminLoginResponse = {
  token: string;
  admin?: {
    id: string;
    nome: string;
    email: string;
    role?: AdminRoleApi;
  };
};

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>();

  async function onSubmit(data: AdminLoginForm) {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          senha: data.senha,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { erro?: string; error?: string }
          | null;

        throw new Error(
          body?.erro ?? body?.error ?? "Login ou senha inválidos."
        );
      }

      const body: AdminLoginResponse = await res.json();

      if (body.token) {
        // limpa cookies antigos
        Cookies.remove("adminToken");
        Cookies.remove("adminRole");
        Cookies.remove("adminName");

        // token do admin
        Cookies.set("adminToken", body.token, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        // infos auxiliares (não sensíveis)
        if (body.admin?.role) {
          Cookies.set("adminRole", String(body.admin.role), {
            expires: 7,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
          });
        }

        if (body.admin?.nome) {
          Cookies.set("adminName", body.admin.nome, {
            expires: 7,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
          });
        }
      }

      toast.success("Login realizado com sucesso!");
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 space-y-8">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-sm text-muted-foreground">
          Acesse com seu e-mail e senha de administrador.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@clubexavante.com"
              {...register("email", { required: "E-mail é obrigatório" })}
              disabled={isLoading}
              onChange={(e) => {
                setError("");
                // mantém o registro do react-hook-form
                return register("email").onChange(e);
              }}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="********"
              {...register("senha", { required: "Senha é obrigatória" })}
              disabled={isLoading}
              onChange={(e) => {
                setError("");
                return register("senha").onChange(e);
              }}
            />
            {errors.senha && (
              <p className="text-xs text-red-600">{errors.senha.message}</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>

      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Acesso restrito a administradores e equipe de portaria.</p>
        <p>
          Voltar para o site{" "}
          <Link href="/" className="text-primary hover:underline">
            principal
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
