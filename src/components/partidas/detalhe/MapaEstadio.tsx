"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ValorSetor } from "./ExibicaoMapaSetor"

// tipo completo que o CardSetor espera
export type SetorCompleto = {
  id: string          // slug
  nome: string
  preco: number
  disponibilidade: number
  setorId: string
  jogoSetorId: string
  loteId: string
}

// configuração estática só do layout (posição na imagem)
const layoutSetores: Array<{
  id: string
  box: { left: number; top: number; width: number; height: number }
}> = [
  { id: "jk", box: { left: 18, top: 17, width: 60, height: 12 } },
  { id: "social", box: { left: 18, top: 72, width: 60, height: 10 } },
  { id: "cativas", box: { left: 60.5, top: 82, width: 18, height: 8 } },
  { id: "norte", box: { left: 12, top: 30, width: 10, height: 45 } },
  { id: "sul", box: { left: 75, top: 32, width: 10, height: 45 } },
]

const RATIO = 1000 / 800

type MapaEstadioProps = {
  className?: string
  valores: ValorSetor[]
  selecionadoId: string | null
  onSelect: (setor: SetorCompleto | null) => void
}

export function MapaEstadio({
  className,
  valores,
  selecionadoId,
  onSelect,
}: MapaEstadioProps) {
  // helper: pega o valor do setor pelo slug
  const getSetorCompleto = (id: string): SetorCompleto | null => {
    const valor = valores.find((v) => v.id === id)
    if (!valor) return null

    return {
      id: valor.id,
      nome: valor.nome,
      preco: valor.preco,
      disponibilidade: valor.disponibilidade,
      setorId: valor.setorId,
      jogoSetorId: valor.jogoSetorId,
      loteId: valor.loteId,
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden border bg-muted/40 mx-auto md:mx-0",
        className,
      )}
    >
      <div className="relative w-full" style={{ aspectRatio: `${RATIO}` }}>
        <Image
          src="/stadium-map.png"
          alt="Mapa do Estádio Bento Freitas"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />

        <TooltipProvider delayDuration={100}>
          {layoutSetores.map((s) => {
            const valor = valores.find((v) => v.id === s.id)

            const preco = valor?.preco ?? 0
            const disponibilidade = valor?.disponibilidade ?? 0
            const nome = valor?.nome ?? s.id.toUpperCase()

            const isSelecionado = selecionadoId === s.id

            return (
              <Tooltip key={s.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Selecionar ${nome}`}
                    onClick={() => {
                      const setorCompleto = getSetorCompleto(s.id)
                      if (!setorCompleto) return
                      onSelect(setorCompleto)
                    }}
                    className={cn(
                      "absolute rounded-md transition-all outline-none",
                      isSelecionado
                        ? "ring-2 ring-primary/60 bg-primary/10"
                        : "hover:bg-primary/10",
                    )}
                    style={{
                      left: `${s.box.left}%`,
                      top: `${s.box.top}%`,
                      width: `${s.box.width}%`,
                      height: `${s.box.height}%`,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="px-3 py-1.5">
                  <p className="font-medium text-sm">{nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {preco.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    · {disponibilidade} lugares
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
