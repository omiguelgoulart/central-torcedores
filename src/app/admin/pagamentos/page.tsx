// app/admin/pagamentos/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb";
import { PagamentosResumoCards } from "@/components/admin/pagamento/PagamentosResumoCards";
import { PagamentosFiltros } from "@/components/admin/pagamento/PagamentosFiltros";
import { PagamentosTabela } from "@/components/admin/pagamento/PagamentosTabela";
import {
  MetodoPagamentoApi,
  PaymentRow,
  PaymentStatus,
  PaymentKind,
} from "@/components/admin/pagamento/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type PagamentoApi = {
  id: string;
  torcedorId: string;
  valor: string | number;
  status: PaymentStatus;
  dataVencimento: string;
  pagoEm: string | null;
  referencia: string | null;
  metodo: MetodoPagamentoApi;
  descricao: string | null;
  faturaId?: string | null;
  torcedor?: {
    nome: string | null;
  } | null;
  ingressos?: { id: string }[];
  pedidos?: { id: string }[];
  fatura?: {
    assinatura?: {
      plano?: {
        nome: string | null;
      } | null;
    } | null;
  } | null;
};

function detectarTipoPagamento(p: PagamentoApi): PaymentKind {
  if (p.faturaId || p.fatura?.assinatura?.plano) return "PLANO";
  if ((p.ingressos?.length ?? 0) > 0 || (p.pedidos?.length ?? 0) > 0)
    return "INGRESSO";
  return "OUTRO";
}

function getOrigemLabel(p: PagamentoApi): string | null {
  if (p.fatura?.assinatura?.plano?.nome) {
    return p.fatura.assinatura.plano.nome;
  }
  return null;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"TODOS" | PaymentStatus>(
    "TODOS"
  );
  const [metodoFiltro, setMetodoFiltro] = useState<
    "TODOS" | MetodoPagamentoApi
  >("TODOS");

  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarPagamentos() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/pagamento`);
        if (!res.ok) {
          throw new Error("Erro ao buscar pagamentos");
        }

        const data: PagamentoApi[] = await res.json();

        const rows: PaymentRow[] = data.map((p) => {
          const dataBase = p.pagoEm ?? p.dataVencimento;
          const dt = new Date(dataBase);
          const dataFormatada = Number.isNaN(dt.getTime())
            ? dataBase
            : dt.toLocaleDateString("pt-BR");

          const tipo = detectarTipoPagamento(p);
          const origemLabel = getOrigemLabel(p);

          const valorNumber =
            typeof p.valor === "number" ? p.valor : Number(p.valor);

          return {
            id: p.id,
            torcedorNome:
              p.torcedor?.nome ?? `Torcedor #${p.torcedorId.slice(0, 8)}`,
            valor: valorNumber,
            status: p.status,
            metodo: p.metodo,
            data: dataFormatada,
            referencia: p.referencia ?? null,
            tipo,
            origemLabel,
          };
        });

        setPayments(rows);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os pagamentos.");
      } finally {
        setLoading(false);
      }
    }

    void carregarPagamentos();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const textoBusca = `${p.torcedorNome} ${p.referencia ?? ""} ${p.valor} ${
        p.origemLabel ?? ""
      }`
        .toLowerCase()
        .trim();

      const termo = searchTerm.toLowerCase().trim();
      const bateBusca = termo === "" ? true : textoBusca.includes(termo);

      const bateStatus =
        statusFiltro === "TODOS" ? true : p.status === statusFiltro;

      const bateMetodo =
        metodoFiltro === "TODOS" ? true : p.metodo === metodoFiltro;

      return bateBusca && bateStatus && bateMetodo;
    });
  }, [payments, searchTerm, statusFiltro, metodoFiltro]);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pagamentos", href: "/admin/pagamentos" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-balance">Pagamentos</h1>
        <p className="text-muted-foreground">
          Gerencie transações de ingressos, planos e outras receitas.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && payments.length > 0 && (
        <PagamentosResumoCards payments={payments} />
      )}

      <Card>
        <CardContent className="pt-6">
          <PagamentosFiltros
            searchTerm={searchTerm}
            statusFiltro={statusFiltro}
            metodoFiltro={metodoFiltro}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFiltro}
            onMetodoChange={setMetodoFiltro}
          />
        </CardContent>
      </Card>

      <PagamentosTabela payments={filteredPayments} loading={loading} />
    </div>
  );
}
