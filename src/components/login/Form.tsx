"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { FormField } from "./Field"

interface LoginForm {
  email: string
  senha: string
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError("")

    try {
      // Aqui você implementaria a lógica de login
      console.log("Dados de login:", data)

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirecionar após login bem-sucedido
      // router.push('/dashboard')
    } catch {
      setError("Erro ao fazer login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          register={register("email", {
            required: "Email é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido",
            },
          })}
          error={errors.email}
        />

        <FormField
          id="senha"
          label="Senha"
          type="password"
          placeholder="Sua senha"
          register={register("senha", {
            required: "Senha é obrigatória",
            minLength: {
              value: 6,
              message: "Senha deve ter pelo menos 6 caracteres",
            },
          })}
          error={errors.senha}
        />

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
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-primary hover:underline">
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </>
  )
}
