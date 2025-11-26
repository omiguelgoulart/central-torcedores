"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MetodoPagamentoApi, PaymentStatus } from "./types"

type PagamentosFiltrosProps = {
  searchTerm: string
  statusFiltro: "TODOS" | PaymentStatus
  metodoFiltro: "TODOS" | MetodoPagamentoApi
  onSearchChange: (value: string) => void
  onStatusChange: (value: "TODOS" | PaymentStatus) => void
  onMetodoChange: (value: "TODOS" | MetodoPagamentoApi) => void
}

export function PagamentosFiltros({
  searchTerm,
  statusFiltro,
  metodoFiltro,
  onSearchChange,
  onStatusChange,
  onMetodoChange,
}: PagamentosFiltrosProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="search" className="text-xs mb-1 block">
          Buscar
        </Label>
        <Input
          id="search"
          placeholder="Torcedor, referência, valor..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="w-full md:w-40">
        <Label className="text-xs mb-1 block">Status</Label>
        <Select
          value={statusFiltro}
          onValueChange={(value) =>
            onStatusChange(value as "TODOS" | PaymentStatus)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="PAGO">Pago</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="ATRASADO">Atrasado</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
            <SelectItem value="FALHA">Falha</SelectItem>
            <SelectItem value="AGENDADO">Agendado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-40">
        <Label className="text-xs mb-1 block">Método</Label>
        <Select
          value={metodoFiltro}
          onValueChange={(value) =>
            onMetodoChange(value as "TODOS" | MetodoPagamentoApi)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="PIX">Pix</SelectItem>
            <SelectItem value="CARTAO">Cartão</SelectItem>
            <SelectItem value="BOLETO">Boleto</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
