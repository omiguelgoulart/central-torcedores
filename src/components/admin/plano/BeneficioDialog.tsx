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
import { Switch } from "@/components/ui/switch"

import { Beneficio } from "./TabelaBeneficios"

export type BeneficioFormMode = "create" | "edit"

export type BeneficioFormValues = {
  slug: string
  titulo: string
  descricao: string
  destaque: boolean
  ativo: boolean
  observacao: string
}

type BeneficioDialogProps = {
  open: boolean
  mode: BeneficioFormMode
  initialData: Beneficio | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: BeneficioFormValues) => Promise<void>
  submitting?: boolean
}

export function BeneficioDialog({
  open,
  mode,
  initialData,
  onOpenChange,
  onSubmit,
  submitting = false,
}: BeneficioDialogProps) {
  const [form, setForm] = useState<BeneficioFormValues>({
    slug: "",
    titulo: "",
    descricao: "",
    destaque: false,
    ativo: true,
    observacao: "",
  })

  useEffect(() => {
    if (!open) return

    if (mode === "edit" && initialData) {
      setForm({
        slug: initialData.slug,
        titulo: initialData.titulo,
        descricao: initialData.descricao ?? "",
        destaque: initialData.destaque,
        ativo: initialData.ativo,
        observacao: initialData.observacao ?? "",
      })
    } else if (mode === "create") {
      setForm({
        slug: "",
        titulo: "",
        descricao: "",
        destaque: false,
        ativo: true,
        observacao: "",
      })
    }
  }, [open, mode, initialData])

  async function handleSubmit() {
    await onSubmit(form)
  }

  const tituloDialog =
    mode === "create"
      ? "Novo benefício"
      : `Editar benefício${initialData ? `: ${initialData.titulo}` : ""}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>  {tituloDialog}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="titulo-beneficio">Título</Label>
            <Input
              id="titulo-beneficio"
              value={form.titulo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, titulo: e.target.value }))
              }
              placeholder="Ex.: Desconto em ingressos"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="slug-beneficio">Slug</Label>
            <Input
              id="slug-beneficio"
              value={form.slug}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="ex.: ticket-discount"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="descricao-beneficio">Descrição</Label>
            <Textarea
              id="descricao-beneficio"
              value={form.descricao}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, descricao: e.target.value }))
              }
              placeholder="Descrição curta do benefício..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="destaque-beneficio"
                checked={form.destaque}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, destaque: checked }))
                }
              />
              <Label htmlFor="destaque-beneficio">Destacar no card</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="ativo-beneficio"
                checked={form.ativo}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, ativo: checked }))
                }
              />
              <Label htmlFor="ativo-beneficio">Ativo</Label>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="observacao-beneficio">Observação</Label>
            <Textarea
              id="observacao-beneficio"
              value={form.observacao}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, observacao: e.target.value }))
              }
              placeholder="Alguma observação adicional (opcional)..."
              rows={2}
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
