"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { regrasSenhaStatus, validaSenha } from "@/components/login/validaSenha"

// schema zod usando mesma regra da API
const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "Senha obrigatória"),
  confirmarSenha: z.string().min(1, "Confirmação obrigatória"),
}).superRefine((data, ctx) => {
  const erros = validaSenha(data.senha)
  if (erros.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: erros[0], // mostra o primeiro erro; UI abaixo lista todos
      path: ["senha"],
    })
  }
  if (data.senha !== data.confirmarSenha) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "As senhas não conferem",
      path: ["confirmarSenha"],
    })
  }
})

type RegisterData = z.infer<typeof schema>

export function FormCadastro() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<RegisterData>({
    resolver: zodResolver(schema),
    mode: "onChange",            // ✅ valida enquanto digita
    reValidateMode: "onChange",
  })

  const senha = watch("senha") ?? ""

  const status = useMemo(() => regrasSenhaStatus(senha), [senha])
  const checklist = [
    { ok: status.temMin,    label: "Mínimo de 8 caracteres" },
    { ok: status.temMinusc, label: "Pelo menos 1 letra minúscula" },
    { ok: status.temMaiusc, label: "Pelo menos 1 letra maiúscula" },
    { ok: status.temNumero, label: "Pelo menos 1 número" },
    { ok: status.temSimbolo,label: "Pelo menos 1 símbolo" },
  ]

  const onSubmit = async (data: RegisterData) => {
    setLoading(true)
    const dismiss = toast.loading("Cadastrando...")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: data.nome, email: data.email, senha: data.senha }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.erro || "Falha no cadastro")
      }

      toast.success("Conta criada com sucesso!")
      router.push("/login")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Não foi possível cadastrar"
      toast.error(errorMessage)
    } finally {
      toast.dismiss(dismiss)
      setLoading(false)
    }
  }

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-live="polite">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" placeholder="Seu nome" {...register("nome")} disabled={loading} className="w-full" />
        {errors.nome && <span className="text-red-500 text-sm">{errors.nome.message}</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="seu@email.com" autoComplete="email"
          {...register("email")} disabled={loading} className="w-full" />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      </div>

    <div className="space-y-2">
      <Label htmlFor="senha">Senha</Label>
      <Input
        id="senha"
        type="password"
        placeholder="********"
        autoComplete="new-password"
        {...register("senha")}
        disabled={loading}
        className="w-full"
      />
      {errors.senha && <span className="text-red-500 text-sm">{errors.senha.message}</span>}

      {/* ✅ Checklist em tempo real, aparece somente quando começar a ser digitado */}
      {senha.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
        {checklist.map((item) => (
          <li key={item.label} className={item.ok ? "text-green-600" : "text-muted-foreground"}>
            {item.label}
          </li>
        ))}
        </ul>
      )}
    </div>

      <div className="space-y-2">
        <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
        <Input id="confirmarSenha" type="password" placeholder="********" autoComplete="new-password"
          {...register("confirmarSenha")} disabled={loading} className="w-full" />
        {errors.confirmarSenha && (
          <span className="text-red-500 text-sm">{errors.confirmarSenha.message}</span>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading || !isValid}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>

        <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <a href="/login" className="text-primary hover:underline">
                    Entre aqui
                </a>
                </p>
            </div>
     </div>       
  )
}
