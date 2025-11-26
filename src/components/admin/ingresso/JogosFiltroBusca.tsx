"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type JogosFiltroBuscaProps = {
  value: string
  onChange: (value: string) => void
}

export function JogosFiltroBusca({ value, onChange }: JogosFiltroBuscaProps) {
  return (
    <div className="flex-1">
      <Label htmlFor="busca-jogos" className="text-xs mb-1 block">
        Buscar jogo
      </Label>
      <Input
        id="busca-jogos"
        placeholder="Nome do adversário, data..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
