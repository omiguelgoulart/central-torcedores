"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import {
  Socio,
  StatusSocio,
  TabelaTorcedores,
} from "@/components/admin/torcedores/TabelaTorcedores"
import { ResumoCard } from "@/components/admin/torcedores/ResumoCard"
import { FiltroBusca } from "@/components/admin/torcedores/FiltroBusca"
import { FiltroStatusSelect } from "@/components/admin/torcedores/FiltroStatusSelect"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type TorcedorListaApi = {
  id: string
  nome: string
  email: string
  cpf?: string | null
  statusSocio?: string | null
  assinaturas?: {
    plano?: {
      nome?: string | null
    } | null
  }[]
}

export default function PageTorcedores() {
  const [termoBusca, setTermoBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | StatusSocio>("TODOS")
  const [socios, setSocios] = useState<Socio[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarSocios() {
      try {
        setCarregando(true)
        setErro(null)

        const resposta = await fetch(`${API}/usuario`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })

        if (!resposta.ok) {
          console.error("Falha no GET /usuario")
          setSocios([])
          return
        }

        const dados: TorcedorListaApi[] = await resposta.json()

        if (!Array.isArray(dados)) {
          setSocios([])
          return
        }

        const sociosMapeados: Socio[] = dados.map((item) => {
          const statusRaw = (item.statusSocio ?? "ATIVO").toUpperCase()

          const status: StatusSocio =
            statusRaw === "ATIVO" ||
            statusRaw === "INADIMPLENTE" ||
            statusRaw === "CANCELADO"
              ? (statusRaw as StatusSocio)
              : "ATIVO"

          const planoNome =
            item.assinaturas?.[0]?.plano?.nome ??
            "Sem plano"

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
    const termo = termoBusca.toLowerCase().trim()

    return socios.filter((socio) => {
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

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResumoCard label="Total de Torcedores" value={socios.length} />
        <ResumoCard
          label="Ativos"
          value={sociosAtivos}
          valueClassName="text-green-600"
        />
        <ResumoCard
          label="Inadimplentes"
          value={sociosInadimplentes}
          valueClassName="text-destructive"
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <FiltroBusca
              id="busca-torcedores"
              label="Buscar"
              placeholder="Nome, email, CPF..."
              value={termoBusca}
              onChange={setTermoBusca}
            />

            <FiltroStatusSelect
              label="Status"
              value={statusFiltro}
              onChange={(value) =>
                setStatusFiltro(value as "TODOS" | StatusSocio)
              }
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "ATIVO", label: "ATIVO" },
                { value: "INADIMPLENTE", label: "INADIMPLENTE" },
                { value: "CANCELADO", label: "CANCELADO" },
              ]}
            />
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
          <TabelaTorcedores socios={sociosFiltrados} />
        </CardContent>
      </Card>
    </div>
  )
}
