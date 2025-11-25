"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TipoSetor } from "./types"

type FiltroTipo = "TODOS" | TipoSetor

type SetorFiltrosProps = {
  termoBusca: string
  onChangeTermoBusca: (valor: string) => void
  filtroTipo: FiltroTipo
  onChangeFiltroTipo: (valor: FiltroTipo) => void
}

export function SetorFiltros({
  termoBusca,
  onChangeTermoBusca,
  filtroTipo,
  onChangeFiltroTipo,
}: SetorFiltrosProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="busca" className="text-xs mb-1 block">
          Buscar
        </Label>
        <Input
          id="busca"
          placeholder="Nome do setor..."
          value={termoBusca}
          onChange={(e) => onChangeTermoBusca(e.target.value)}
        />
      </div>

      <div className="w-full md:w-52">
        <Label className="text-xs mb-1 block">Tipo</Label>
        <Select
          value={filtroTipo}
          onValueChange={(valor) =>
            onChangeFiltroTipo(valor as "TODOS" | TipoSetor)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="ARQUIBANCADA">Arquibancada</SelectItem>
            <SelectItem value="CADEIRA">Cadeira</SelectItem>
            <SelectItem value="CAMAROTE">Camarote</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
