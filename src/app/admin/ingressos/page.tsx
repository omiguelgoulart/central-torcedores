// app/admin/ingressos/jogos/page.tsx
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { JogosResumoCards } from "@/components/admin/ingresso/JogosResumoCards"
import { JogosFiltroBusca } from "@/components/admin/ingresso/JogosFiltroBusca"
import { JogosTabela } from "@/components/admin/ingresso/JogosTabela"
import { JogoListaItem } from "@/components/admin/ingresso/types"
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb"

const jogosMock: JogoListaItem[] = [
  {
    id: "1",
    nome: "Brasil de Pelotas vs Time A",
    data: "2025-12-10",
    hora: "19:00",
    totalPedidos: 25,
    reservasAtivas: 5,
    pendentesPagamento: 3,
    valorTotal: 1170,
    totalCheckins: 2745,
    taxaCheckin: 95,
  },
  {
    id: "2",
    nome: "Brasil de Pelotas vs Time B",
    data: "2025-12-15",
    hora: "20:30",
    totalPedidos: 10,
    reservasAtivas: 2,
    pendentesPagamento: 1,
    valorTotal: 540,
    totalCheckins: 1050,
    taxaCheckin: 87,
  },
]

export default function JogosIngressosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const jogosFiltrados = useMemo(() => {
    return jogosMock.filter((jogo) =>
      `${jogo.nome} ${jogo.data}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Ingressos por Jogo", href: "/admin/ingressos/jogos" },
        ]}
      />

      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Ingressos por Jogo
          </h1>
          <p className="text-muted-foreground">
            Acompanhe vendas, reservas e check-ins por partida.
          </p>
        </div>
      </div>

      {/* Resumo geral */}
      <JogosResumoCards jogos={jogosMock} />

      {/* Filtro por jogo */}
      <Card>
        <CardContent className="pt-6">
          <JogosFiltroBusca
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
          />
        </CardContent>
      </Card>

      {/* Tabela de jogos */}
      <JogosTabela jogos={jogosFiltrados} />
    </div>
  )
}
