"use client"

import { Card, CardContent } from "@/components/ui/card"

type SetorResumoCardsProps = {
  totalSetores: number
  capacidadeTotal: number
  capacidadeMedia: number
  carregando: boolean
}

export function SetorResumoCards({
  totalSetores,
  capacidadeTotal,
  capacidadeMedia,
  carregando,
}: SetorResumoCardsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Total de setores
            </p>
            <p className="text-2xl font-bold">{totalSetores}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Capacidade total
            </p>
            <p className="text-2xl font-bold">
              {capacidadeTotal.toLocaleString("pt-BR")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Média por setor
            </p>
            <p className="text-2xl font-bold">
              {capacidadeMedia.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
        {carregando && (
          <p className="mt-4 text-xs text-muted-foreground">
            Carregando setores da API...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
