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
import { StatusPedido } from "./types"

type JogoDetalheFiltrosProps = {
  busca: string
  statusFiltro: "TODOS" | StatusPedido
  setorFiltro: string
  setores: string[]
  onBuscaChange: (value: string) => void
  onStatusChange: (value: "TODOS" | StatusPedido) => void
  onSetorChange: (value: string) => void
}

export function JogoDetalheFiltros({
  busca,
  statusFiltro,
  setorFiltro,
  setores,
  onBuscaChange,
  onStatusChange,
  onSetorChange,
}: JogoDetalheFiltrosProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="busca" className="text-xs mb-1 block">
          Buscar
        </Label>
        <Input
          id="busca"
          placeholder="Nome do torcedor, ID..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
        />
      </div>

      <div className="w-full md:w-40">
        <Label className="text-xs mb-1 block">Status</Label>
        <Select
          value={statusFiltro}
          onValueChange={(value) =>
            onStatusChange(value as "TODOS" | StatusPedido)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="RASCUNHO">Rascunho</SelectItem>
            <SelectItem value="RESERVA_ATIVA">Reserva ativa</SelectItem>
            <SelectItem value="PENDENTE_PAGAMENTO">
              Pendente pagamento
            </SelectItem>
            <SelectItem value="PAGO">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-52">
        <Label className="text-xs mb-1 block">Setor</Label>
        <Select
          value={setorFiltro}
          onValueChange={(value) => onSetorChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os setores" />
          </SelectTrigger>
          <SelectContent>
            {setores.map((setor) => (
              <SelectItem key={setor} value={setor}>
                {setor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
