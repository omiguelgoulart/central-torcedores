"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Setor, TipoSetor } from "./types"

export type SetorFormValues = {
  nome: string
  capacidade: number
  tipo: TipoSetor
}

type SetorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  modo: "create" | "edit"
  setor?: Setor | null
  onSalvar: (values: SetorFormValues) => void
}

export function SetorDialog({
  open,
  onOpenChange,
  modo,
  setor,
  onSalvar,
}: SetorDialogProps) {
  const [nome, setNome] = useState("")
  const [capacidade, setCapacidade] = useState("")
  const [tipo, setTipo] = useState<TipoSetor>("ARQUIBANCADA")

  // Preenche o form quando entrar em modo edição
  useEffect(() => {
    if (modo === "edit" && setor) {
      setNome(setor.nome)
      setCapacidade(String(setor.capacidade))
      setTipo(setor.tipo)
    } else {
      setNome("")
      setCapacidade("")
      setTipo("ARQUIBANCADA")
    }
  }, [modo, setor])

  function handleSalvar() {
    const capacidadeNumero = Number(capacidade)

    if (!nome.trim()) return
    if (!Number.isFinite(capacidadeNumero) || capacidadeNumero <= 0) return

    onSalvar({
      nome: nome.trim(),
      capacidade: capacidadeNumero,
      tipo,
    })

    onOpenChange(false)
  }

  function handleClose() {
    onOpenChange(false)
  }

  const titulo = modo === "edit" ? "Editar setor" : "Cadastrar novo setor"
  const descricao =
    "Defina nome, tipo e capacidade aproximada do setor do estádio."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome do setor</Label>
            <Input
              id="nome"
              placeholder="Ex.: Arquibancada Sul"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                id="capacidade"
                type="number"
                min={0}
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                placeholder="Ex.: 5000"
              />
            </div>

            <div className="space-y-1">
              <Label>Tipo de setor</Label>
              <Select
                value={tipo}
                onValueChange={(valor) => setTipo(valor as TipoSetor)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARQUIBANCADA">Arquibancada</SelectItem>
                  <SelectItem value="CADEIRA">Cadeira</SelectItem>
                  <SelectItem value="CAMAROTE">Camarote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>
            {modo === "edit" ? "Salvar alterações" : "Criar setor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
