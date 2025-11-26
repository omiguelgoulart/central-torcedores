"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PedidoJogo, ResumoCheckinJogo, StatusPedido } from "@/components/admin/ingresso/types"
import { JogoDetalheResumoVendas } from "@/components/admin/ingresso/JogoDetalheResumoVendas"
import { JogoDetalheResumoCheckin } from "@/components/admin/ingresso/JogoDetalheResumoCheckin"
import { JogoDetalheFiltros } from "@/components/admin/ingresso/JogoDetalheFiltros"
import { JogoDetalheTabelaPedidos } from "@/components/admin/ingresso/JogoDetalheTabelaPedidos"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

const setoresMock = [
  "Todos",
  "Arquibancada Sul",
  "Arquibancada Norte",
  "Cadeiras",
  "Camarote",
]

type SocioApi = {
  nome: string | null
}

type CheckinApi = {
  id: string
}

type IngressoFullApi = {
  id: string
  valor: string | number
  status: string
  socio: SocioApi | null
  checkins?: CheckinApi[]
}

type JogoFullApi = {
  id: string
  nome: string
  data: string
  local: string | null
  descricao: string | null
  ingressos: IngressoFullApi[]
}

function formatDateTime(dateStr: string): { data: string; hora: string } {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) {
    return { data: dateStr, hora: "" }
  }
  return {
    data: d.toLocaleDateString("pt-BR"),
    hora: d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

function parseValor(valor: string | number): number {
  if (typeof valor === "number") return valor
  const normalized = valor.replace(".", "").replace(",", ".")
  const num = Number(normalized)
  return Number.isNaN(num) ? 0 : num
}

export default function JogoIngressosDetalhePage() {
  const params = useParams<{ id: string }>()
  const jogoId = params.id

  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | StatusPedido>(
    "TODOS",
  )
  const [setorFiltro, setSetorFiltro] = useState<string>("Todos")

  const [jogoNome, setJogoNome] = useState<string | null>(null)
  const [jogoDataBr, setJogoDataBr] = useState<string>("")
  const [jogoHoraBr, setJogoHoraBr] = useState<string>("")
  const [jogoLocal, setJogoLocal] = useState<string>("")

  const [pedidos, setPedidos] = useState<PedidoJogo[]>([])
  const [resumoCheckin, setResumoCheckin] =
    useState<ResumoCheckinJogo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarJogo() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API}/admin/jogo/${jogoId}/full`)
        if (!res.ok) {
          throw new Error("Erro ao buscar dados do jogo")
        }

        const data: JogoFullApi = await res.json()

        const { data: dataBr, hora } = formatDateTime(data.data)
        setJogoNome(data.nome)
        setJogoDataBr(dataBr)
        setJogoHoraBr(hora)
        setJogoLocal(data.local ?? "")

        const ingressos = data.ingressos ?? []

        const pedidosMapeados: PedidoJogo[] = ingressos.map((ing) => ({
          id: ing.id,
          torcedor: ing.socio?.nome ?? "Não informado",
          setor: "Não informado",
          status: "PAGO" as StatusPedido,
          quantidade: 1,
          total: parseValor(ing.valor),
          expiraEm: null,
        }))

        setPedidos(pedidosMapeados)

        const totalIngressos = ingressos.length
        const totalCheckins = ingressos.reduce(
          (acc, ing) => acc + (ing.checkins?.length ?? 0),
          0,
        )

        const taxaCheckin =
          totalIngressos > 0
            ? Math.round((totalCheckins / totalIngressos) * 100)
            : 0

        const resumo: ResumoCheckinJogo = {
          totalCheckins,
          taxaCheckin,
          portoesAtivos: 0,
        }

        setResumoCheckin(resumo)
      } catch (err) {
        console.error(err)
        setError("Não foi possível carregar os dados do jogo.")
      } finally {
        setLoading(false)
      }
    }

    if (jogoId) {
      void carregarJogo()
    }
  }, [jogoId])

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const texto = `${p.torcedor} ${p.id}`.toLowerCase()
      const bateBusca = texto.includes(busca.toLowerCase())

      const bateStatus =
        statusFiltro === "TODOS" ? true : p.status === statusFiltro

      const bateSetor = setorFiltro === "Todos" ? true : p.setor === setorFiltro

      return bateBusca && bateStatus && bateSetor
    })
  }, [pedidos, busca, statusFiltro, setorFiltro])

  return (
    <div className="space-y-6">

      {/* Cabeçalho do jogo */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">
            {jogoNome
              ? `Ingressos – ${jogoNome}`
              : `Ingressos – Jogo #${jogoId}`}
          </h1>
          <p className="text-muted-foreground text-sm">
            {jogoNome
              ? `${jogoDataBr} • ${jogoHoraBr}${
                  jogoLocal ? ` • ${jogoLocal}` : ""
                }`
              : "Carregando informações do jogo..."}
          </p>
        </div>

        <Link href="/admin/ingressos/jogos">
          <Button variant="outline" size="sm">
            Voltar para jogos
          </Button>
        </Link>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && pedidos.length > 0 && (
        <>
          <JogoDetalheResumoVendas pedidos={pedidos} />
          {resumoCheckin && (
            <JogoDetalheResumoCheckin resumo={resumoCheckin} />
          )}
        </>
      )}

      <Card>
        <CardContent className="pt-6">
          <JogoDetalheFiltros
            busca={busca}
            statusFiltro={statusFiltro}
            setorFiltro={setorFiltro}
            setores={setoresMock}
            onBuscaChange={setBusca}
            onStatusChange={setStatusFiltro}
            onSetorChange={setSetorFiltro}
          />
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Carregando ingressos...
        </p>
      ) : (
        <JogoDetalheTabelaPedidos pedidos={pedidosFiltrados} />
      )}
    </div>
  )
}
