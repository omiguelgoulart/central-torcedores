"use client"

import { Jogo, JogoCard } from "./CardJogo"


export function ListaJogos() {
  const jogos: Jogo[] = [
    {
      id: "1",
      nome: "Brasil de Pelotas x Grêmio",
      data: "2025-11-10T19:30:00.000Z",
      local: "Estádio Bento Freitas",
      descricao: "Rodada 15 do Campeonato Gaúcho. Um clássico imperdível em Pelotas!",
      status: "Ingressos disponíveis"
    },
    {
      id: "2",
      nome: "Brasil de Pelotas x Juventude",
      data: "2025-11-24T18:00:00.000Z",
      local: "Estádio Bento Freitas",
      descricao: "Duelo direto pela classificação no Gauchão.",
      status: "Últimos ingressos"
    },
    {
      id: "3",
      nome: "Brasil de Pelotas x Inter",
      data: "2025-12-05T20:00:00.000Z",
      local: "Estádio Bento Freitas",
      descricao: "Encerramento da fase de grupos com casa cheia!",
      status: "Esgotado"
    }
  ]
  const agora = new Date();
  const jogosFuturos = jogos
    .filter(j => new Date(j.data) > agora)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  jogos.splice(0, jogos.length, ...jogosFuturos);
  return (
    <div className="flex flex-col gap-6">
      {jogos.map((jogo) => (
        <JogoCard key={jogo.id} jogo={jogo} />
      ))}
    </div>
  )
}
