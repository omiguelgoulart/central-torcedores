import { notFound } from "next/navigation"
import { ExibicaoMapaSetor } from "@/components/partidas/detalhe/ExibicaoMapaSetor"
import { PartidaHeader } from "@/components/partidas/detalhe/HeaderPartida"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

export const revalidate = 0

type IngressoApi = {
  id: string
}

type JogoSetorLoteApi = {
  id: string
  precoUnitario: number | string
  ingressos: IngressoApi[]
}

type JogoSetorApi = {
  id: string
  capacidade: number
  setor: {
    id: string
    slug: string
    nome: string
  }
  lotes: JogoSetorLoteApi[]
}

type PartidaApi = {
  id: string
  nome: string
  data: string
  local: string
  mandante?: string | null
  visitante?: string | null
  setores: JogoSetorApi[]
}

type PartidaDetalhePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function PartidaDetalhePage({
  params,
}: PartidaDetalhePageProps) {
  const { id } = await params

  let partidaApi: PartidaApi

  try {
    const partidaRes = await fetch(
      `${API}/admin/jogo/${encodeURIComponent(id)}/jogo`,
      {
        cache: "no-store",
      },
    )

    if (!partidaRes.ok) {
      if (partidaRes.status === 404) {
        notFound()
      }
      throw new Error("Falha ao buscar partida")
    }

    partidaApi = (await partidaRes.json()) as PartidaApi
  } catch (error) {
    console.error("Erro ao carregar partida:", error)
    notFound()
  }

  const partida = {
    id: partidaApi.id,
    nome: partidaApi.nome,
    data: partidaApi.data,
    local: partidaApi.local,
  }

  const setoresApi = Array.isArray(partidaApi.setores)
    ? partidaApi.setores
    : []

  const valores = setoresApi.map((jogoSetor) => {
    const primeiroLote = jogoSetor.lotes[0]

    const precoRaw = primeiroLote?.precoUnitario ?? 0
    const precoLote =
      typeof precoRaw === "string" ? Number(precoRaw) : precoRaw

    const vendidos = jogoSetor.lotes.reduce(
      (total, lote) => total + lote.ingressos.length,
      0,
    )

    const disponibilidade = jogoSetor.capacidade - vendidos

    return {
      id: jogoSetor.setor.slug,
      nome: jogoSetor.setor.nome,
      preco: Number.isFinite(precoLote) ? precoLote : 0,
      disponibilidade: disponibilidade > 0 ? disponibilidade : 0,

      setorId: jogoSetor.setor.id,
      jogoSetorId: jogoSetor.id,
      loteId: primeiroLote?.id ?? "",
    }
  })

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <PartidaHeader partida={partida} />
      <ExibicaoMapaSetor jogoId={partida.id} valores={valores} />
    </div>
  )
}
