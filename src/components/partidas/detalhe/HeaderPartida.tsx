"use client"

import { Calendar, MapPin, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface PartidaHeaderProps {
  partida: {
    id: string
    nome: string
    data: string // ISO ou texto
    local: string
  }
}

export function PartidaHeader({ partida }: PartidaHeaderProps) {
  const dataObj = new Date(partida.data)

  const dataFormatada = isNaN(dataObj.getTime())
    ? partida.data
    : dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })

  const horaFormatada = isNaN(dataObj.getTime())
    ? ""
    : dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })

  return (
    <Card className="w-full shadow-sm border bg-card">
      <CardContent className="py-6 space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Partida
          </p>

          <h1 className="text-2xl font-bold mt-1">
            {partida.nome}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Calendar className="h-5 w-5 text-primary" />
            <span>
              {dataFormatada}
              {horaFormatada && (
                <span className="block text-muted-foreground text-xs">
                  {horaFormatada}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{partida.local}</span>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Users className="h-5 w-5 text-primary" />
            <span>Escolha o setor no mapa</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
