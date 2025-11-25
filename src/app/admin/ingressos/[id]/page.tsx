// app/admin/ingressos/[id]/page.tsx
"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  PedidoJogo,
  ResumoCheckinJogo,
  StatusPedido,
} from "@/components/admin/ingresso/types"
import { JogoDetalheResumoVendas } from "@/components/admin/ingresso/JogoDetalheResumoVendas"
import { JogoDetalheResumoCheckin } from "@/components/admin/ingresso/JogoDetalheResumoCheckin"
import { JogoDetalheFiltros } from "@/components/admin/ingresso/JogoDetalheFiltros"
import { JogoDetalheTabelaPedidos } from "@/components/admin/ingresso/JogoDetalheTabelaPedidos"
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb"

const setoresMock = ["Todos", "Arquibancada Sul", "Arquibancada Norte", "Cadeiras", "Camarote"]

// Mock de pedidos de UM jogo
const pedidosMock: PedidoJogo[] = [
  {
    id: "1",
    torcedor: "João Silva",
    setor: "Arquibancada Sul",
    status: "RESERVA_ATIVA",
    quantidade: 2,
    total: 360,
    expiraEm: "2025-12-10",
  },
  {
    id: "2",
    torcedor: "Maria Santos",
    setor: "Arquibancada Sul",
    status: "PAGO",
    quantidade: 1,
    total: 180,
    expiraEm: null,
  },
  {
    id: "3",
    torcedor: "Pedro Costa",
    setor: "Arquibancada Norte",
    status: "PENDENTE_PAGAMENTO",
    quantidade: 3,
    total: 540,
    expiraEm: "2025-12-11",
  },
]

const resumoCheckinMock: ResumoCheckinJogo = {
  totalCheckins: 2745,
  taxaCheckin: 95,
  portoesAtivos: 3,
}

export default function JogoIngressosDetalhePage() {
  const params = useParams<{ id: string }>()
  const jogoId = params.id

  const [busca, setBusca] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | StatusPedido>(
    "TODOS",
  )
  const [setorFiltro, setSetorFiltro] = useState<string>("Todos")

  const pedidosFiltrados = useMemo(() => {
    return pedidosMock.filter((p) => {
      const texto = `${p.torcedor} ${p.id}`.toLowerCase()
      const bateBusca = texto.includes(busca.toLowerCase())

      const bateStatus =
        statusFiltro === "TODOS" ? true : p.status === statusFiltro

      const bateSetor =
        setorFiltro === "Todos" ? true : p.setor === setorFiltro

      return bateBusca && bateStatus && bateSetor
    })
  }, [busca, statusFiltro, setorFiltro])

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Ingressos por Jogo", href: "/admin/ingressos/jogos" },
          { label: `Jogo #${jogoId}` },
        ]}
      />

      {/* Cabeçalho do jogo */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">
            Ingressos – Jogo #{jogoId}
          </h1>
          <p className="text-muted-foreground">
            Brasil de Pelotas vs Time A • 10/12/2025 • 19:00
          </p>
        </div>

        <Link href="/admin/ingressos/jogos">
          <Button variant="outline" size="sm">
            Voltar para jogos
          </Button>
        </Link>
      </div>

      {/* Resumo vendas + check-in */}
      <JogoDetalheResumoVendas pedidos={pedidosMock} />
      <JogoDetalheResumoCheckin resumo={resumoCheckinMock} />

      {/* Filtros – busca + status + setor */}
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

      {/* Tabela de pedidos desse jogo */}
      <JogoDetalheTabelaPedidos pedidos={pedidosFiltrados} />
    </div>
  )
}
