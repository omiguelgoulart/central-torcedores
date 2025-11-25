"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit2, Eye } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type StatusAssinatura = "ATIVA" | "SUSPENSA" | "CANCELADA"

type AssinaturaApi = {
  id: string
  status?: string | null
  inicioEm?: string | null
  proximaCobrancaEm?: string | null
  planoNome?: string | null
  plano?: {
    nome?: string | null
  } | null
  torcedorNome?: string | null
  torcedor?: {
    nome?: string | null
  } | null
}

type Assinatura = {
  id: string
  torcedor: string
  plano: string
  status: StatusAssinatura | "OUTRO"
  inicio: string | null
  proxima: string | null
}

const assinaturasIniciais: Assinatura[] = [
  { id: "1", torcedor: "João Silva", plano: "Ouro", status: "ATIVA", inicio: "2024-01-15", proxima: "2025-01-15" },
  { id: "2", torcedor: "Maria Santos", plano: "Platina", status: "ATIVA", inicio: "2024-03-20", proxima: "2025-03-20" },
  { id: "3", torcedor: "Pedro Costa", plano: "Bronze", status: "SUSPENSA", inicio: "2024-06-10", proxima: null },
  { id: "4", torcedor: "Ana Oliveira", plano: "Ouro", status: "CANCELADA", inicio: "2024-02-28", proxima: null },
]

function formatarDataBr(valor: string | null): string {
  if (!valor) return "-"
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return "-"
  return data.toLocaleDateString("pt-BR")
}

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | StatusAssinatura>("TODOS")
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>(assinaturasIniciais)
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
          return
        }

        const dados = (await resposta.json()) as AssinaturaApi[]

        if (!Array.isArray(dados) || dados.length === 0) {
          return
        }

        const mapeadas: Assinatura[] = dados.map((a) => {
          const statusRaw = (a.status ?? "ATIVA").toUpperCase()
          const status: StatusAssinatura | "OUTRO" =
            statusRaw === "ATIVA" || statusRaw === "SUSPENSA" || statusRaw === "CANCELADA"
              ? (statusRaw as StatusAssinatura)
              : "OUTRO"

          const plano = a.plano?.nome ?? a.planoNome ?? "Plano sem nome"
          const torcedor = a.torcedor?.nome ?? a.torcedorNome ?? "Torcedor não identificado"

          return {
            id: a.id,
            plano,
            torcedor,
            status,
            inicio: a.inicioEm ?? null,
            proxima: a.proximaCobrancaEm ?? null,
          }
        })

        setAssinaturas(mapeadas)
      } catch (erroFetch) {
        console.error(erroFetch)
        setErro("Erro ao carregar assinaturas.")
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

  function badgeVariant(status: Assinatura["status"]) {
    if (status === "ATIVA") return "default" as const
    if (status === "SUSPENSA") return "secondary" as const
    if (status === "CANCELADA") return "outline" as const
    return "outline" as const
  }

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
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{assinaturas.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ativas</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Suspensas</p>
              <p className="text-2xl font-bold text-amber-600">{suspendedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Receita Mensal</p>
              {/* por enquanto fixo; depois podemos somar valor da API */}
              <p className="text-2xl font-bold text-primary">R$ 5.870</p>
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
                placeholder="Torcedor, plano..."
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
                  setStatusFiltro(e.target.value as "TODOS" | StatusAssinatura)
                }
              >
                <option value="TODOS">Todos</option>
                <option value="ATIVA">ATIVA</option>
                <option value="SUSPENSA">SUSPENSA</option>
                <option value="CANCELADA">CANCELADA</option>
              </select>
            </div>
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

      {/* Tabela de Assinaturas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Lista de Assinaturas ({assinaturasFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Torcedor</th>
                  <th className="text-left py-3 font-medium">Plano</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Início</th>
                  <th className="text-left py-3 font-medium">Próxima Cobrança</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assinaturasFiltradas.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{sub.torcedor}</td>
                    <td className="py-3">{sub.plano}</td>
                    <td className="py-3">
                      <Badge variant={badgeVariant(sub.status)}>
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatarDataBr(sub.inicio)}
                    </td>
                    <td className="py-3 font-semibold">
                      {formatarDataBr(sub.proxima)}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {assinaturasFiltradas.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhuma assinatura encontrada com os filtros atuais.
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
