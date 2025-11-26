"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { JogosResumoCards } from "@/components/admin/ingresso/JogosResumoCards";
import { JogosFiltroBusca } from "@/components/admin/ingresso/JogosFiltroBusca";
import { JogosTabela } from "@/components/admin/ingresso/JogosTabela";
import { JogoListaItem } from "@/components/admin/ingresso/types";
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type JogoApi = {
  id: string;
  nome: string;
  data: string;
  local?: string | null;
  descricao?: string | null;
};

type IngressoApi = {
  id: string;
  valor: string | number;
};

type IngressoListResponse = {
  items: IngressoApi[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("pt-BR");
}

function formatHour(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function parseValor(valor: string | number): number {
  if (typeof valor === "number") return valor;
  const normalized = valor.replace(".", "").replace(",", ".");
  const num = Number(normalized);
  return Number.isNaN(num) ? 0 : num;
}

export default function JogosIngressosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jogos, setJogos] = useState<JogoListaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarJogos() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/admin/jogo`);
        if (!res.ok) {
          throw new Error("Erro ao buscar jogos");
        }

        const jogosApi: JogoApi[] = await res.json();

        const jogosComStats = await Promise.all(
          jogosApi.map<Promise<JogoListaItem>>(async (jogo) => {
            let totalPedidos = 0;
            let valorTotal = 0;

            try {
              const ingressosRes = await fetch(
                `${API}/admin/ingresso?jogoId=${jogo.id}&page=1&pageSize=1000`
              );

              if (ingressosRes.ok) {
                const data: IngressoListResponse = await ingressosRes.json();
                totalPedidos = data.total;
                valorTotal = data.items.reduce(
                  (acc, ingresso) => acc + parseValor(ingresso.valor),
                  0
                );
              }
            } catch {}

            return {
              id: jogo.id,
              nome: jogo.nome,
              data: formatDate(jogo.data),
              hora: formatHour(jogo.data),
              totalPedidos,
              reservasAtivas: 0,
              pendentesPagamento: 0,
              valorTotal,
              totalCheckins: 0,
              taxaCheckin: 0,
            };
          })
        );

        setJogos(jogosComStats);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os jogos.");
      } finally {
        setLoading(false);
      }
    }

    carregarJogos();
  }, []);

  const jogosFiltrados = useMemo(() => {
    return jogos.filter((jogo) =>
      `${jogo.nome} ${jogo.data}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [jogos, searchTerm]);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Jogos", href: "/admin/jogos" },
        ]}
      />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-balance">Lista de Jogos</h1>
          <p className="text-muted-foreground">
            Acompanhe vendas, reservas e check-ins por partida.
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && jogos.length > 0 && <JogosResumoCards jogos={jogos} />}

      <Card>
        <CardContent className="pt-6">
          <JogosFiltroBusca
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
          />
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando jogos...</p>
      ) : (
        <JogosTabela jogos={jogosFiltrados} />
      )}
    </div>
  );
}
