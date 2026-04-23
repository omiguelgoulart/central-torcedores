"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface AdminLoginForm {
  email: string;
  senha: string;
}

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginAdmin, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>();

  async function onSubmit(data: AdminLoginForm) {
    setError("");

    try {
      await loginAdmin(data.email, data.senha);
      toast.success("Login realizado com sucesso!");
      router.push("/admin");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao tentar fazer login.");
      }
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
              disabled={loading}
              onChange={(e) => {
                setError("");
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
              disabled={loading}
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
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
