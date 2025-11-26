"use client";

import { useEffect, useState } from "react";
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb";
import { CartaoKPI } from "@/components/admin/kpiCard";
import {
  TrendingUp,
  Users,
  Ticket,
  DollarSign,
  ActivitySquare,
  CheckCircle2,
} from "lucide-react";
import { formatBRL } from "@/lib/formatters";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

// ---- tipos da API ----

type StatusPagamentoApi =
  | "PENDENTE"
  | "PAGO"
  | "ATRASADO"
  | "CANCELADO"
  | "AGENDADO"
  | string;

type PagamentoApi = {
  id: string;
  valor: number | string;
  status: StatusPagamentoApi;
  dataVencimento: string;
  pagoEm?: string | null;
};

type StatusAssinaturaApi =
  | "ATIVA"
  | "CANCELADA"
  | "SUSPENSA"
  | "EXPIRADA"
  | string;

type AssinaturaApi = {
  id: string;
  status: StatusAssinaturaApi;
};

type StatusFaturaApi = "ABERTA" | "PAGA" | "CANCELADA" | string;

type FaturaApi = {
  id: string;
  valor: number | string;
  status: StatusFaturaApi;
  vencimentoEm: string;
};

type IngressoListResponse = {
  total: number;
};

function parseDecimal(valor: number | string): number {
  if (typeof valor === "number") return valor;
  const normalized = valor.replace(".", "").replace(",", ".");
  const num = Number(normalized);
  return Number.isNaN(num) ? 0 : num;
}

export default function PageDashboard() {
  const [loading, setLoading] = useState(false);

  const [arrecadacaoMes, setArrecadacaoMes] = useState(0);
  const [ingressosEmitidos, setIngressosEmitidos] = useState(0);
  const [checkinsRealizados] = useState(0); // por enquanto 0, depois ligamos em endpoint de check-in

  const [sociosAtivos, setSociosAtivos] = useState(0);
  const [sociosInadimplentes, setSociosInadimplentes] = useState(0);
  const [receitaPrevista, setReceitaPrevista] = useState(0);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true);

        const [pagRes, assRes, fatRes, ingRes] = await Promise.all([
          fetch(`${API}/pagamento`),
          fetch(`${API}/assinatura`),
          fetch(`${API}/fatura`),
          fetch(`${API}/admin/ingresso?page=1&pageSize=1`),
        ]);

        // Pagamentos
        if (pagRes.ok) {
          const pagamentos: PagamentoApi[] = await pagRes.json();
          const agora = new Date();
          const mesAtual = agora.getMonth();
          const anoAtual = agora.getFullYear();

          const totalMes = pagamentos.reduce((acumulado, pagamento) => {
            if (pagamento.status !== "PAGO") return acumulado;

            const dataBase =
              pagamento.pagoEm != null && pagamento.pagoEm !== ""
                ? new Date(pagamento.pagoEm)
                : new Date(pagamento.dataVencimento);

            if (
              Number.isNaN(dataBase.getTime()) ||
              dataBase.getMonth() !== mesAtual ||
              dataBase.getFullYear() !== anoAtual
            ) {
              return acumulado;
            }

            return acumulado + parseDecimal(pagamento.valor);
          }, 0);

          setArrecadacaoMes(totalMes);
        }

        // Assinaturas
        if (assRes.ok) {
          const assinaturas: AssinaturaApi[] = await assRes.json();

          const ativos = assinaturas.filter(
            (a) => a.status === "ATIVA",
          ).length;

          const inadimplentes = assinaturas.filter((a) =>
            ["SUSPENSA", "EXPIRADA"].includes(a.status),
          ).length;

          setSociosAtivos(ativos);
          setSociosInadimplentes(inadimplentes);
        }

        // Faturas
        if (fatRes.ok) {
          const faturas: FaturaApi[] = await fatRes.json();

          const abertasTotal = faturas
            .filter((f) => f.status === "ABERTA")
            .reduce(
              (acc, fatura) => acc + parseDecimal(fatura.valor),
              0,
            );

          setReceitaPrevista(abertasTotal);
        }

        // Ingressos
        if (ingRes.ok) {
          const ingressos: IngressoListResponse = await ingRes.json();
          setIngressosEmitidos(ingressos.total ?? 0);
        }
      } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
      } finally {
        setLoading(false);
      }
    }

    void carregarDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "Dashboard", href: "/admin" }]} />

      {/* Cabeçalho da página */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral de operações
          {loading ? " • carregando..." : ""}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CartaoKPI
          titulo="Arrecadação (Mês)"
          valor={formatBRL(arrecadacaoMes)}
          icone={DollarSign}
          tendencia="alta"
          valorTendencia="+12%"
        />

        <CartaoKPI
          titulo="Ingressos Emitidos"
          valor={ingressosEmitidos.toString()}
          icone={Ticket}
          tendencia="alta"
          valorTendencia="+8%"
        />

        <CartaoKPI
          titulo="Check-ins Realizados"
          valor={checkinsRealizados.toString()}
          icone={CheckCircle2}
          tendencia="alta"
          valorTendencia="+0%"
        />

        <CartaoKPI
          titulo="Sócios Ativos"
          valor={sociosAtivos.toString()}
          icone={Users}
          tendencia="alta"
          valorTendencia="+5%"
        />

        <CartaoKPI
          titulo="Sócios Inadimplentes"
          valor={sociosInadimplentes.toString()}
          icone={ActivitySquare}
          tendencia="baixa"
          valorTendencia="-2%"
        />

        <CartaoKPI
          titulo="Receita Prevista"
          valor={formatBRL(receitaPrevista)}
          icone={TrendingUp}
          tendencia="alta"
          valorTendencia="+22%"
        />
      </div>
    </div>
  );
}
