"use client"


import { CartaoKPI } from "@/components/admin/kpiCard"
import { TrendingUp, Users, Ticket, DollarSign, ActivitySquare, CheckCircle2 } from "lucide-react"

export default function PageDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral de operações</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CartaoKPI
          titulo="Arrecadação (Mês)"
          valor="R$ 125.430"
          icone={DollarSign}
          tendencia="alta"
          valorTendencia="+12%"
        />
        <CartaoKPI titulo="Ingressos Emitidos" valor="3.245" icone={Ticket} tendencia="alta" valorTendencia="+8%" />
        <CartaoKPI
          titulo="Check-ins Realizados"
          valor="2.890"
          icone={CheckCircle2}
          tendencia="alta"
          valorTendencia="+15%"
        />
        <CartaoKPI titulo="Sócios Ativos" valor="1.204" icone={Users} tendencia="alta" valorTendencia="+5%" />
        <CartaoKPI
          titulo="Sócios Inadimplentes"
          valor="38"
          icone={ActivitySquare}
          tendencia="baixa"
          valorTendencia="-2%"
        />
        <CartaoKPI
          titulo="Receita Prevista"
          valor="R$ 425.890"
          icone={TrendingUp}
          tendencia="alta"
          valorTendencia="+22%"
        />
      </div>
    </div>
  )
}
