"use client"

import { Jogo, JogoCard } from "./CardJogo"

interface ListaJogosProps {
  jogos: Jogo[]
}

export function ListaJogos({ jogos }: ListaJogosProps) {
  const agora = new Date()

  const jogosFuturos = jogos
    .filter((jogo) => new Date(jogo.data) > agora)
    .sort(
      (a, b) =>
        new Date(a.data).getTime() - new Date(b.data).getTime(),
    )

  if (jogosFuturos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Não há partidas futuras disponíveis no momento.
      </p>
    )
  }

  return (
    <div className=" gap-4  flex overflow-x-auto pb-2 md:justify-between ">
      {jogosFuturos.map((jogo) => (
        <div
          key={jogo.id}
          className="
            flex-shrink-0
            min-w-[85%]
            sm:min-w-[60%]
            md:min-w-[32%]

          "
        >
          <JogoCard jogo={jogo} />
        </div>
      ))}
    </div>
  )
}
