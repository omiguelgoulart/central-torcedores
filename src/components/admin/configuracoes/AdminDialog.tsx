"use client"

import { useEffect, useState, FormEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AdminRole, AdminRow } from "./types"

export type AdminFormValues = {
  nome: string
  email: string
  role: AdminRole
  ativo: boolean
  senha?: string
}

type AdminDialogProps = {
  mode: "create" | "edit"
  admin?: AdminRow
  onSubmit: (values: AdminFormValues) => void
  children: React.ReactNode
}

export function AdminDialog({
  mode,
  admin,
  onSubmit,
  children,
}: AdminDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<AdminFormValues>({
    nome: "",
    email: "",
    role: "ADMIN",
    ativo: true,
    senha: "",
  })

  useEffect(() => {
    if (open && admin && mode === "edit") {
      setForm({
        nome: admin.nome,
        email: admin.email,
        role: admin.role,
        ativo: admin.ativo,
        senha: "",
      })
    }

    if (open && mode === "create") {
      setForm({
        nome: "",
        email: "",
        role: "ADMIN",
        ativo: true,
        senha: "",
      })
    }
  }, [open, admin, mode])

  function handleChange<K extends keyof AdminFormValues>(
    field: K,
    value: AdminFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit(form)
    setOpen(false)
  }

  const title =
    mode === "create" ? "Novo administrador" : "Editar administrador"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Defina os dados e a função deste usuário no painel.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Função</Label>
            <Select
              value={form.role}
              onValueChange={(value) =>
                handleChange("role", value as AdminRole)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="PORTARIA">Colaborador portaria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <Label className="text-sm">Status</Label>
              <p className="text-xs text-muted-foreground">
                Controle se este usuário pode acessar o painel.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.ativo}
                onCheckedChange={(checked) =>
                  handleChange("ativo", checked)
                }
              />
              <span className="text-sm">
                {form.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>

          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="senha">Senha inicial</Label>
              <Input
                id="senha"
                type="password"
                value={form.senha ?? ""}
                onChange={(e) => handleChange("senha", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                A senha será usada no primeiro acesso. Depois, ele pode
                redefinir.
              </p>
            </div>
          )}

          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="senha">Alterar senha (opcional)</Label>
              <Input
                id="senha"
                type="password"
                value={form.senha ?? ""}
                onChange={(e) => handleChange("senha", e.target.value)}
                placeholder="Deixe em branco para não alterar"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit">
              {mode === "create" ? "Cadastrar" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
