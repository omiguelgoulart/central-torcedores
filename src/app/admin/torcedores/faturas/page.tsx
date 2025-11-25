"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fatura, StatusFatura, TabelaFaturas } from "@/components/admin/torcedores/TabelaFaturas"
import { ResumoCard } from "@/components/admin/torcedores/ResumoCard"
import { FiltroStatusSelect } from "@/components/admin/torcedores/FiltroStatusSelect"
import { FiltroBusca } from "@/components/admin/torcedores/FiltroBusca"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type FaturaApi = {
  id: string
  competencia?: string | null
  valor?: number | string | null
  status?: string | null
  vencimento?: string | null
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

export default function PsgeFatura() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | StatusFatura>("TODOS")
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarFaturas() {
      try {
        setCarregando(true)
        setErro(null)

        const resposta = await fetch(`${API}/fatura`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })

        if (!resposta.ok) {
          console.error("Falha ao buscar faturas em /fatura")
          setFaturas([])
          return
        }

        const dadosRaw = await resposta.json()

        if (!Array.isArray(dadosRaw) || dadosRaw.length === 0) {
          setFaturas([])
          return
        }

        const dados = dadosRaw as FaturaApi[]

        const mapeadas: Fatura[] = dados.map((f) => {
          // normaliza o valor vindo da API (string, número, centavos)
          const raw = f.valor ?? 0
          const valorNumeroBruto =
            typeof raw === "string" ? Number.parseFloat(raw) : Number(raw)

          const valorNumero =
            Number.isFinite(valorNumeroBruto) && valorNumeroBruto > 1000
              ? valorNumeroBruto / 100 // se vier em centavos (ex: 6990)
              : valorNumeroBruto

          const statusRaw = (f.status ?? "ABERTA").toString().toUpperCase()
          const status: StatusFatura =
            statusRaw === "ABERTA" || statusRaw === "PAGA" || statusRaw === "ATRASADA"
              ? (statusRaw as StatusFatura)
              : "OUTRO"

          const torcedor = f.torcedor?.nome ?? f.torcedorNome ?? "Torcedor não identificado"

          return {
            id: f.id,
            competencia: f.competencia ?? "-",
            valorNumero,
            valorFormatado: valorNumero.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
            status,
            vencimento: f.vencimento ?? null,
            torcedor,
          }
        })

        setFaturas(mapeadas)
      } catch (erroFetch) {
        console.error(erroFetch)
        setErro("Erro ao carregar faturas.")
        setFaturas([])
      } finally {
        setCarregando(false)
      }
    }

    carregarFaturas()
  }, [])

  const paidCount = useMemo(
    () => faturas.filter((i) => i.status === "PAGA").length,
    [faturas],
  )

  const openCount = useMemo(
    () => faturas.filter((i) => i.status === "ABERTA" || i.status === "ATRASADA").length,
    [faturas],
  )

  // soma em número mesmo; formatação fica por conta do ResumoCard
  const totalFaturado = useMemo(
    () => faturas.reduce((acc, f) => acc + f.valorNumero, 0),
    [faturas],
  )

  const faturasFiltradas = useMemo(() => {
    const termo = searchTerm.toLowerCase().trim()

    return faturas.filter((invoice) => {
      const bateBusca =
        !termo ||
        invoice.torcedor.toLowerCase().includes(termo) ||
        invoice.competencia.toLowerCase().includes(termo)

      const bateStatus =
        statusFiltro === "TODOS" ? true : invoice.status === statusFiltro

      return bateBusca && bateStatus
    })
  }, [faturas, searchTerm, statusFiltro])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Faturas</h1>
        <p className="text-muted-foreground">Gerenciar faturas de assinaturas</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ResumoCard label="Total" value={faturas.length} />
        <ResumoCard
          label="Pagas"
          value={paidCount}
          valueClassName="text-green-600"
        />
        <ResumoCard
          label="Pendentes/Atrasadas"
          value={openCount}
          valueClassName="text-amber-600"
        />
        {/* Aqui vai o número cru; o ResumoCard formata em R$ */}
        <ResumoCard
          label="Total Faturado"
          value={totalFaturado}
          valueClassName="text-primary"
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <FiltroBusca
              id="search-faturas"
              label="Buscar"
              placeholder="Torcedor, competência..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <FiltroStatusSelect
              label="Status"
              value={statusFiltro}
              onChange={(value) =>
                setStatusFiltro(value as "TODOS" | StatusFatura)
              }
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "ABERTA", label: "ABERTA" },
                { value: "PAGA", label: "PAGA" },
                { value: "ATRASADA", label: "ATRASADA" },
              ]}
            />
          </div>
          {carregando && (
            <p className="mt-3 text-xs text-muted-foreground">
              Carregando faturas da API...
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
            Lista de Faturas ({faturasFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabelaFaturas
            faturas={faturasFiltradas}
            formatarData={formatarDataBr}
          />
        </CardContent>
      </Card>
    </div>
  )
}
