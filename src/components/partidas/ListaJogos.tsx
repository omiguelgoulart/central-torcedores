"use client"

import { Jogo, JogoCard } from "./CardJogo"

interface ListaJogosProps {
  jogos: Jogo[]
}

export function ListaJogos({ jogos }: ListaJogosProps) {
  if (jogos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Não há partidas futuras disponíveis no momento.
      </p>
    )
  }

  return (
    <div className="flex gap-4 pb-2 md:justify-between">
      {jogos.map((jogo) => (
        <div
          key={jogo.id}
          className="flex-shrink-0 min-w-[85%] sm:min-w-[60%] md:min-w-[32%]"
        >
          <JogoCard jogo={jogo} />
        </div>
      ))}
    </div>
  )
}