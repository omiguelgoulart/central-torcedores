"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Assinatura,
  StatusAssinatura,
  TabelaAssinaturas,
} from "@/components/admin/torcedores/TabelaAssinaturas"
import { ResumoCard } from "@/components/admin/torcedores/ResumoCard"
import { FiltroStatusSelect } from "@/components/admin/torcedores/FiltroStatusSelect"
import { FiltroBusca } from "@/components/admin/torcedores/FiltroBusca"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type AssinaturaApi = {
  id: string
  status?: string | null
  statusAssinatura?: string | null
  inicioEm?: string | null
  proximaCobrancaEm?: string | null
  planoNome?: string | null
  plano?: {
    nome?: string | null
    valor?: number | null
  } | null
  torcedorNome?: string | null
  torcedor?: {
    nome?: string | null
  } | null
}

function formatarDataBr(valor: string | null): string {
  if (!valor) return "-"
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return "-"
  return data.toLocaleDateString("pt-BR")
}

export default function PageAssinatura() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | StatusAssinatura>("TODOS")
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarAssinaturas() {
      try {
        setCarregando(true)
        setErro(null)

        const resposta = await fetch(`${API}/assinatura`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })

        if (!resposta.ok) {
          console.error("Falha ao buscar assinaturas em /assinatura")
          setAssinaturas([])
          return
        }

        const dadosRaw = await resposta.json()

        if (!Array.isArray(dadosRaw)) {
          setAssinaturas([])
          return
        }

        const dados = dadosRaw as AssinaturaApi[]

        const mapeadas: Assinatura[] = dados.map((a) => {
          const rawStatus = (a.statusAssinatura ?? a.status ?? "ATIVA")
            .toString()
            .toUpperCase()

          const status: StatusAssinatura =
            rawStatus === "ATIVA" || rawStatus === "SUSPENSA" || rawStatus === "CANCELADA"
              ? (rawStatus as StatusAssinatura)
              : "OUTRO"

          const plano = a.plano?.nome ?? a.planoNome ?? "Plano sem nome"
          const torcedor = a.torcedor?.nome ?? a.torcedorNome ?? "Torcedor não identificado"

          const preco = a.plano?.valor ?? 0

          return {
            id: a.id,
            plano,
            torcedor,
            status,
            inicio: a.inicioEm ?? null,
            proxima: a.proximaCobrancaEm ?? null,
            preco,
          }
        })

        setAssinaturas(mapeadas)
      } catch (erroFetch) {
        console.error(erroFetch)
        setErro("Erro ao carregar assinaturas.")
        setAssinaturas([])
      } finally {
        setCarregando(false)
      }
    }

    carregarAssinaturas()
  }, [])

  const activeCount = useMemo(
    () => assinaturas.filter((s) => s.status === "ATIVA").length,
    [assinaturas],
  )

  const suspendedCount = useMemo(
    () => assinaturas.filter((s) => s.status === "SUSPENSA").length,
    [assinaturas],
  )

  // 🔥 Receita mensal com base nas assinaturas ATIVAS
  const receitaMensal = useMemo(() => {
    return assinaturas
      .filter((a) => a.status === "ATIVA")
      .reduce((total, item) => total + (item.preco ?? 0), 0)
  }, [assinaturas])

  const assinaturasFiltradas = useMemo(() => {
    const termo = searchTerm.toLowerCase().trim()

    return assinaturas.filter((sub) => {
      const bateBusca =
        !termo ||
        sub.torcedor.toLowerCase().includes(termo) ||
        sub.plano.toLowerCase().includes(termo)

      const bateStatus =
        statusFiltro === "TODOS" ? true : sub.status === statusFiltro

      return bateBusca && bateStatus
    })
  }, [assinaturas, searchTerm, statusFiltro])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Assinaturas</h1>
          <p className="text-muted-foreground">Gerenciar assinaturas de planos</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ResumoCard label="Total" value={assinaturas.length} />
        <ResumoCard label="Ativas" value={activeCount} valueClassName="text-green-600" />
        <ResumoCard label="Suspensas" value={suspendedCount} valueClassName="text-amber-600" />
        <ResumoCard
          label="Receita Mensal"
          value={receitaMensal}
          valueClassName="text-primary"
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <FiltroBusca
              id="search-assinaturas"
              label="Buscar"
              placeholder="Torcedor, plano..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <FiltroStatusSelect
              label="Status"
              value={statusFiltro}
              onChange={(value) =>
                setStatusFiltro(value as "TODOS" | StatusAssinatura)
              }
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "ATIVA", label: "ATIVA" },
                { value: "SUSPENSA", label: "SUSPENSA" },
                { value: "CANCELADA", label: "CANCELADA" },
              ]}
            />
          </div>
          {carregando && (
            <p className="mt-3 text-xs text-muted-foreground">
              Carregando assinaturas da API...
            </p>
          )}
          {erro && (
            <p className="mt-3 text-xs text-destructive">
              {erro}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Lista de Assinaturas ({assinaturasFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabelaAssinaturas
            assinaturas={assinaturasFiltradas}
            formatarData={formatarDataBr}
          />
        </CardContent>
      </Card>
    </div>
  )
}
