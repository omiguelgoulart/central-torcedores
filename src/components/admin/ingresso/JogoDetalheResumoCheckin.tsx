"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ResumoCheckinJogo } from "./types"

type JogoDetalheResumoCheckinProps = {
  resumo: ResumoCheckinJogo
}

export function JogoDetalheResumoCheckin({
  resumo,
}: JogoDetalheResumoCheckinProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Total de Check-ins
          </p>
          <p className="text-2xl font-bold">{resumo.totalCheckins}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Taxa de Check-in
          </p>
          <p className="text-2xl font-bold text-green-500">
            {resumo.taxaCheckin}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Portões Ativos
          </p>
          <p className="text-2xl font-bold">{resumo.portoesAtivos}</p>
        </CardContent>
      </Card>
    </div>
  )
}
