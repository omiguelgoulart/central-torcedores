"use client"

import { Jogo, JogoCard } from "./CardJogo"


export function ListaJogos() {
  // Mock com base na estrutura real da API
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
  // filtra apenas jogos com data futura (strictamente depois de agora) e ordena por data asc
  const agora = new Date();
  const jogosFuturos = jogos
    .filter(j => new Date(j.data) > agora)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  // substitui o conteúdo do array original para que o return existente continue a usar `jogos`
  jogos.splice(0, jogos.length, ...jogosFuturos);
  return (
    <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {jogos.map((jogo) => (
        <JogoCard key={jogo.id} jogo={jogo} />
      ))}
    </div>
  )
}
