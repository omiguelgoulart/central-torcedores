"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface LoginForm {
  email: string;
  senha: string;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const { login } = useAuth();

  async function onSubmit(data: LoginForm) {
    setIsLoading(true);
    setError("");
    try {
      await login(data.email, data.senha);
      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao fazer login");
      }
    }
    setIsLoading(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Label>E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register("email", { required: "E-mail é obrigatório" })}
          disabled={isLoading}
        ></Input>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}

        <Label>Senha</Label>
        <Input
          id="senha"
          type="password"
          placeholder="********"
          {...register("senha", { required: "Senha é obrigatória" })}
          disabled={isLoading}
        ></Input>
        {errors.senha && (
          <p className="text-sm text-red-600">{errors.senha.message}</p>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mt-2">
          <Link href="/recuperaSenha" className="text-primary hover:underline">
            Esqueceu sua senha?
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-primary hover:underline">
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </>
  );
}
