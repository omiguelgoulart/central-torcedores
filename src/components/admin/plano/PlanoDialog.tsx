"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { Plano, peridiocidadePlano } from "./TabelaPlanos"
import { Select, SelectItem } from "@/components/ui/select"

export type PlanoFormMode = "create" | "edit"

export type PlanoFormValues = {
  nome: string
  valor: string
  periodicidade: peridiocidadePlano
  descricao: string
}

type PlanoDialogProps = {
  open: boolean
  mode: PlanoFormMode
  initialData: Plano | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: PlanoFormValues) => Promise<void>
  submitting?: boolean
}

export function PlanoDialog({
  open,
  mode,
  initialData,
  onOpenChange,
  onSubmit,
  submitting = false,
}: PlanoDialogProps) {
  const [form, setForm] = useState<PlanoFormValues>({
    nome: "",
    valor: "",
    periodicidade: "MENSAL",
    descricao: "",
  })

  useEffect(() => {
    if (!open) return

    if (mode === "edit" && initialData) {
      setForm({
        nome: initialData.nome,
        valor: String(initialData.valor),
        periodicidade: initialData.periodicidade,
        descricao: "",
      })
    } else if (mode === "create") {
      setForm({
        nome: "",
        valor: "",
        periodicidade: "MENSAL",
        descricao: "",
      })
    }
  }, [open, mode, initialData])

  async function handleSubmit() {
    await onSubmit(form)
  }

  const titulo =
    mode === "create"
      ? "Novo plano"
      : `Editar plano${initialData ? `: ${initialData.nome}` : ""}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="nome-plano">Nome do plano</Label>
            <Input
              id="nome-plano"
              value={form.nome}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nome: e.target.value }))
              }
              placeholder="Ex.: Bronze, Ouro, Platina..."
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="valor-plano">Valor</Label>
            <Input
              id="valor-plano"
              value={form.valor}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, valor: e.target.value }))
              }
              placeholder="Ex.: 99.90"
            />
          </div>

          <div className="space-y-1">
            <Label>Periodicidade</Label>
            <Select
              value={form.periodicidade}
              onValueChange={(value: string) =>
                setForm((prev) => ({ ...prev, periodicidade: value as peridiocidadePlano }))
              }
            >
             <SelectItem value="MENSAL">Mensal</SelectItem>
             <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
             <SelectItem value="SEMESTRAL">Semestral</SelectItem>
             <SelectItem value="ANUAL">Anual</SelectItem>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="descricao-plano">Descrição</Label>
            <Textarea
              id="descricao-plano"
              value={form.descricao}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, descricao: e.target.value }))
              }
              placeholder="Resumo do plano para aparecer no card..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
