import { notFound } from "next/navigation"
import { ExibicaoMapaSetor } from "@/components/partidas/detalhe/ExibicaoMapaSetor"
import { PartidaHeader } from "@/components/partidas/detalhe/HeaderPartida"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

export const revalidate = 0

type PartidaApi = {
  id: string
  nome: string
  data: string
  local: string
  mandante?: string | null
  visitante?: string | null
}

type SetorValorApi = {
  id: string
  preco: number
  disponibilidade: number
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
      `${API}/admin/jogo/${encodeURIComponent(id)}/full`,
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
    mandante: partidaApi.mandante ?? partidaApi.nome ?? "Mandante",
    visitante: partidaApi.visitante ?? "Visitante",
    data: partidaApi.data,
    local: partidaApi.local,
  }

  let setoresApi: SetorValorApi[] = []

  try {
    const setoresRes = await fetch(
      `${API}/partidas/${encodeURIComponent(id)}/setores`,
      {
        cache: "no-store",
      },
    )

    if (!setoresRes.ok) {
      console.error("Erro ao buscar setores da partida:", setoresRes.status)
    } else {
      const json = (await setoresRes.json()) as SetorValorApi[] | null
      if (Array.isArray(json)) {
        setoresApi = json
      }
    }
  } catch (error) {
    console.error("Erro ao carregar setores:", error)
  }

  const valores = setoresApi.map((setor) => ({
    id: setor.id,
    preco: setor.preco,
    disponibilidade: setor.disponibilidade,
  }))

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PartidaHeader partida={partida} />
      <ExibicaoMapaSetor partidaId={partida.id} valores={valores} />
    </div>
  )
}
