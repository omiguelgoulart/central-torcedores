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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {jogos.map((jogo) => (
        <div key={jogo.id} className="min-w-0">
          <JogoCard jogo={jogo} />
        </div>
      ))}
    </div>
  )
}
