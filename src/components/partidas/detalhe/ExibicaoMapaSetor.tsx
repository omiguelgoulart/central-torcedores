"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapaEstadio, SetorCompleto } from "./MapaEstadio"
import { CardSetor } from "./CardSetor"

export type ValorSetor = {
  id: string
  nome: string
  preco: number
  disponibilidade: number
  setorId: string
  jogoSetorId: string 
  loteId: string
}

type ExibicaoMapaSetorProps = {
  jogoId: string
  valores: ValorSetor[]
  titulo?: string
}

export function ExibicaoMapaSetor({
  jogoId,
  valores,
  titulo = "Visual do Estádio Bento Freitas",
}: ExibicaoMapaSetorProps) {
  const [selecionado, setSelecionado] = useState<SetorCompleto | null>(null)

  return (
    <section className="space-y-6 ">
      <Card className="w-full border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-muted-foreground">
            {titulo}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-6 justify-around flex-wrap md:flex-nowrap">
          <MapaEstadio
            className="md:w-1/2 w-full"
            valores={valores}
            selecionadoId={selecionado?.id ?? null}
            onSelect={setSelecionado}
          />

          <div className="md:w-1/2 w-full mx-auto md:mx-0">
            {selecionado ? (
              <CardSetor
                jogoId={jogoId}
                setor={selecionado}
                onCancel={() => setSelecionado(null)}
              />
            ) : (
              <Card className="border border-border/50 bg-background/60 backdrop-blur-sm">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Selecione um setor no mapa para ver detalhes e avançar.
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
