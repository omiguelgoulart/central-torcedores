"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type StatusSocio = "ATIVO" | "INADIMPLENTE" | "CANCELADO"

type TorcedorListaApi = {
  id: string
  nome: string
  email: string
  cpf: string | null
  statusSocio: StatusSocio | null
  // relacionamentos opcionais, caso venham na lista
  assinaturas?: {
    plano?: {
      nome?: string | null
    } | null
  }[]
}

type Socio = {
  id: string
  nome: string
  email: string
  cpf: string
  status: StatusSocio
  plano: string
}

const sociosIniciais: Socio[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@example.com",
    cpf: "123.456.789-00",
    status: "ATIVO",
    plano: "Ouro",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria@example.com",
    cpf: "987.654.321-11",
    status: "ATIVO",
    plano: "Platina",
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@example.com",
    cpf: "456.789.123-22",
    status: "INADIMPLENTE",
    plano: "Bronze",
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    email: "ana@example.com",
    cpf: "789.123.456-33",
    status: "ATIVO",
    plano: "Ouro",
  },
]

export default function PaginaTorcedores() {
  const [termoBusca, setTermoBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | StatusSocio>("TODOS")
  const [socios, setSocios] = useState<Socio[]>(sociosIniciais)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarSocios() {
      try {
        setCarregando(true)
        setErro(null)

        const resposta = await fetch(`${API}/usuario`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (!resposta.ok) {
          console.error("Falha ao buscar lista de torcedores em /usuario")
          return
        }

        const dados: TorcedorListaApi[] = await resposta.json()

        if (!Array.isArray(dados) || dados.length === 0) {
          // mantém mock se vier vazio
          return
        }

        const sociosMapeados: Socio[] = dados.map((item) => {
          const status: StatusSocio = item.statusSocio ?? "ATIVO"

          const planoNome =
            item.assinaturas && item.assinaturas.length > 0
              ? item.assinaturas[0]?.plano?.nome ?? "Sem plano"
              : "Sem plano"

          return {
            id: item.id,
            nome: item.nome,
            email: item.email,
            cpf: item.cpf ?? "Não informado",
            status,
            plano: planoNome,
          }
        })

        setSocios(sociosMapeados)
      } catch (e) {
        console.error(e)
        setErro("Erro ao carregar lista de torcedores.")
      } finally {
        setCarregando(false)
      }
    }

    carregarSocios()
  }, [])

  const sociosFiltrados = useMemo(() => {
    return socios.filter((socio) => {
      const termo = termoBusca.toLowerCase().trim()
      const bateBusca =
        !termo ||
        socio.nome.toLowerCase().includes(termo) ||
        socio.email.toLowerCase().includes(termo) ||
        socio.cpf.toLowerCase().includes(termo)

      const bateStatus =
        statusFiltro === "TODOS" ? true : socio.status === statusFiltro

      return bateBusca && bateStatus
    })
  }, [socios, termoBusca, statusFiltro])

  const sociosAtivos = socios.filter((m) => m.status === "ATIVO").length
  const sociosInadimplentes = socios.filter((m) => m.status === "INADIMPLENTE").length

  function variantStatus(status: StatusSocio) {
    if (status === "ATIVO") return "default" as const
    if (status === "INADIMPLENTE") return "destructive" as const
    return "outline" as const
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-balance">Torcedores</h1>
          <p className="text-muted-foreground">Gerenciar sócios e membros</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Torcedor
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Torcedores</p>
                <p className="text-2xl font-bold">{socios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{sociosAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inadimplentes</p>
                <p className="text-2xl font-bold text-destructive">
                  {sociosInadimplentes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="busca" className="text-xs mb-1 block">
                Buscar
              </Label>
              <Input
                id="busca"
                placeholder="Nome, email, CPF..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <div className="w-full md:w-40">
              <Label className="text-xs mb-1 block">Status</Label>
              <select
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                value={statusFiltro}
                onChange={(e) =>
                  setStatusFiltro(
                    e.target.value as "TODOS" | StatusSocio,
                  )
                }
              >
                <option value="TODOS">Todos</option>
                <option value="ATIVO">ATIVO</option>
                <option value="INADIMPLENTE">INADIMPLENTE</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>
          </div>
          {carregando && (
            <p className="mt-3 text-xs text-muted-foreground">
              Carregando torcedores da API...
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
            Lista de Torcedores ({sociosFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Nome</th>
                  <th className="text-left py-3 font-medium">Email</th>
                  <th className="text-left py-3 font-medium">CPF</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Plano</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sociosFiltrados.map((socio) => (
                  <tr key={socio.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{socio.nome}</td>
                    <td className="py-3 text-muted-foreground">{socio.email}</td>
                    <td className="py-3 font-mono text-xs">{socio.cpf}</td>
                    <td className="py-3">
                      <Badge variant={variantStatus(socio.status)}>
                        {socio.status}
                      </Badge>
                    </td>
                    <td className="py-3">{socio.plano}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/torcedores/${socio.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {sociosFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhum torcedor encontrado com os filtros atuais.
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
