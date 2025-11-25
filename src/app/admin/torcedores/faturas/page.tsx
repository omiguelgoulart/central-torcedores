"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type StatusFatura = "ABERTA" | "PAGA" | "ATRASADA"

type FaturaApi = {
  id: string
  competencia?: string | null
  valor?: number | null
  status?: string | null
  vencimento?: string | null
  torcedorNome?: string | null
  torcedor?: {
    nome?: string | null
  } | null
}

type Fatura = {
  id: string
  competencia: string
  valorNumero: number
  valorFormatado: string
  status: StatusFatura | "OUTRO"
  vencimento: string | null
  torcedor: string
}

const faturasIniciais: Fatura[] = [
  {
    id: "1",
    competencia: "2024-12",
    valorNumero: 199,
    valorFormatado: "R$ 199,00",
    status: "PAGA",
    vencimento: "2024-12-20",
    torcedor: "João Silva",
  },
  {
    id: "2",
    competencia: "2024-11",
    valorNumero: 199,
    valorFormatado: "R$ 199,00",
    status: "PAGA",
    vencimento: "2024-11-20",
    torcedor: "Maria Santos",
  },
  {
    id: "3",
    competencia: "2024-12",
    valorNumero: 299,
    valorFormatado: "R$ 299,00",
    status: "ABERTA",
    vencimento: "2025-01-10",
    torcedor: "Pedro Costa",
  },
  {
    id: "4",
    competencia: "2024-12",
    valorNumero: 199,
    valorFormatado: "R$ 199,00",
    status: "ATRASADA",
    vencimento: "2024-12-10",
    torcedor: "Ana Oliveira",
  },
]

function formatarDataBr(valor: string | null): string {
  if (!valor) return "-"
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return "-"
  return data.toLocaleDateString("pt-BR")
}

function formatarValorBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | StatusFatura>("TODOS")
  const [faturas, setFaturas] = useState<Fatura[]>(faturasIniciais)
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
          return
        }

        const dados = (await resposta.json()) as FaturaApi[]

        if (!Array.isArray(dados) || dados.length === 0) {
          return
        }

        const mapeadas: Fatura[] = dados.map((f) => {
          const valor = f.valor ?? 0
          const statusRaw = (f.status ?? "ABERTA").toUpperCase()
          const status: StatusFatura | "OUTRO" =
            statusRaw === "ABERTA" || statusRaw === "PAGA" || statusRaw === "ATRASADA"
              ? (statusRaw as StatusFatura)
              : "OUTRO"

          const torcedor = f.torcedor?.nome ?? f.torcedorNome ?? "Torcedor não identificado"

          return {
            id: f.id,
            competencia: f.competencia ?? "-",
            valorNumero: valor,
            valorFormatado: formatarValorBRL(valor),
            status,
            vencimento: f.vencimento ?? null,
            torcedor,
          }
        })

        setFaturas(mapeadas)
      } catch (erroFetch) {
        console.error(erroFetch)
        setErro("Erro ao carregar faturas.")
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

  const totalFaturado = useMemo(
    () =>
      faturas.reduce((acc, f) => acc + f.valorNumero, 0),
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

  function badgeVariant(status: Fatura["status"]) {
    if (status === "PAGA") return "default" as const
    if (status === "ATRASADA") return "destructive" as const
    if (status === "ABERTA") return "secondary" as const
    return "outline" as const
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Faturas</h1>
        <p className="text-muted-foreground">Gerenciar faturas de assinaturas</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{faturas.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pagas</p>
              <p className="text-2xl font-bold text-green-600">{paidCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pendentes/Atrasadas</p>
              <p className="text-2xl font-bold text-amber-600">{openCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Faturado</p>
              <p className="text-2xl font-bold text-primary">
                {formatarValorBRL(totalFaturado)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-xs mb-1 block">
                Buscar
              </Label>
              <Input
                id="search"
                placeholder="Torcedor, competência..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-40">
              <Label className="text-xs mb-1 block">Status</Label>
              <select
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                value={statusFiltro}
                onChange={(e) =>
                  setStatusFiltro(e.target.value as "TODOS" | StatusFatura)
                }
              >
                <option value="TODOS">Todos</option>
                <option value="ABERTA">ABERTA</option>
                <option value="PAGA">PAGA</option>
                <option value="ATRASADA">ATRASADA</option>
              </select>
            </div>
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

      {/* Tabela de Faturas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Lista de Faturas ({faturasFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Competência</th>
                  <th className="text-left py-3 font-medium">Torcedor</th>
                  <th className="text-left py-3 font-medium">Valor</th>
                  <th className="text-left py-3 font-medium">Vencimento</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {faturasFiltradas.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{invoice.competencia}</td>
                    <td className="py-3">{invoice.torcedor}</td>
                    <td className="py-3 font-semibold text-primary">
                      {invoice.valorFormatado}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatarDataBr(invoice.vencimento)}
                    </td>
                    <td className="py-3">
                      <Badge variant={badgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {faturasFiltradas.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhuma fatura encontrada com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
