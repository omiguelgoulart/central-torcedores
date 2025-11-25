"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatBRL } from "@/lib/formatters"
import { JogoListaItem } from "./types"

type JogosResumoCardsProps = {
  jogos: JogoListaItem[]
}

export function JogosResumoCards({ jogos }: JogosResumoCardsProps) {
  const totalPedidos = useMemo(
    () => jogos.reduce((acc, j) => acc + j.totalPedidos, 0),
    [jogos],
  )

  const totalValor = useMemo(
    () => jogos.reduce((acc, j) => acc + j.valorTotal, 0),
    [jogos],
  )

  const jogosComCheckin = useMemo(
    () => jogos.filter((j) => j.totalCheckins > 0).length,
    [jogos],
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Total de Jogos
          </p>
          <p className="text-2xl font-bold">{jogos.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Total de Pedidos
          </p>
          <p className="text-2xl font-bold">{totalPedidos}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Jogos com Check-in
          </p>
          <p className="text-2xl font-bold">{jogosComCheckin}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Valor Total Estimado
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatBRL(totalValor)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
