"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { ingressoItf } from "@/app/types/ingressoItf";
import { Chevron } from "@/components/torcedor/meusIngressos/ChevronIngresso";
import { CardIngresso } from "@/components/torcedor/meusIngressos/CardIngresso";
import {
  AbaIngresso,
  TabsIngresso,
} from "@/components/torcedor/meusIngressos/TabsIngressos";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

type TorcedorComPedidos = {
  ingressos?: ingressoItf[];
  pedidos?: Array<{
    torcedorId?: string;
    pagamento?: { externalId?: string | null } | null;
    itens?: Array<{
      loteId?: string;
      valorUnitario?: string | number;
      lote?: ingressoItf["lote"] & { jogo?: ingressoItf["jogo"] };
      ingresso?: {
        id: string;
        qrCode: string;
        status: ingressoItf["status"];
        criadoEm: string;
        usadoEm?: string | null;
        atualizadoEm: string;
      } | null;
    }>;
  }>;
};

function normalizarIngressos(
  torcedor?: TorcedorComPedidos | null,
): ingressoItf[] {
  const ingressosDiretos = torcedor?.ingressos ?? [];

  if (ingressosDiretos.length > 0) {
    return ingressosDiretos.map((ing) => ({
      ...ing,
      valor: String(ing.valor ?? "0"),
      jogo: ing.jogo ?? null,
      lote: ing.lote ?? null,
      torcedorId: ing.torcedorId ?? null,
      loteId: ing.loteId ?? null,
      pagamentoId: ing.pagamentoId ?? null,
    }));
  }

  const pedidos = torcedor?.pedidos ?? [];

  return pedidos.flatMap(
    (pedido) =>
      (pedido.itens ?? [])
        .map((item) => {
          if (!item.ingresso) return null;

          return {
            id: item.ingresso.id,
            torcedorId: pedido.torcedorId ?? null,
            jogoId: item.lote?.jogoId ?? item.lote?.jogo?.id ?? "",
            loteId: item.loteId ?? item.lote?.id ?? null,
            qrCode: item.ingresso.qrCode,
            valor: String(item.valorUnitario ?? 0),
            status: item.ingresso.status,
            criadoEm: item.ingresso.criadoEm,
            usadoEm: item.ingresso.usadoEm ?? null,
            atualizadoEm: item.ingresso.atualizadoEm,
            pagamentoId: pedido.pagamento?.externalId ?? null,
            jogo: item.lote?.jogo ?? null,
            lote: item.lote ?? null,
          } as ingressoItf;
        })
        .filter(Boolean) as ingressoItf[],
  );
}

export default function IngressosPage() {
  const [loadingPagina, setLoadingPagina] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<AbaIngresso>("PROXIMOS");

  const { torcedor, fetchMe } = useAuth();

  useEffect(() => {
    async function carregarUsuario() {
      try {
        setLoadingPagina(true);
        setErro(null);
        await fetchMe();
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar ingressos.");
      } finally {
        setLoadingPagina(false);
      }
    }

    carregarUsuario();
  }, [fetchMe]);

  const ingressos = useMemo<ingressoItf[]>(() => {
    const normalizados = normalizarIngressos(
      torcedor as TorcedorComPedidos | null,
    );

    return [...normalizados].sort((a, b) => {
      const dataA = a.jogo?.data ? new Date(a.jogo.data).getTime() : 0;
      const dataB = b.jogo?.data ? new Date(b.jogo.data).getTime() : 0;
      return dataB - dataA;
    });
  }, [torcedor]);

  const proximos = useMemo(() => {
    return ingressos.filter((ing) => ing.status === "VALIDO");
  }, [ingressos]);

  const anteriores = useMemo(() => {
    return ingressos.filter((ing) => ing.status !== "VALIDO");
  }, [ingressos]);

  const listaVisivel = abaAtiva === "PROXIMOS" ? proximos : anteriores;
  const naoTemIngresso = ingressos.length === 0;

  if (loadingPagina) {
    return (
      <main className="min-h-screen px-4 py-8">
        <p className="text-center text-muted-foreground">
          Carregando ingressos...
        </p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen px-4 py-8">
        <p className="text-center text-muted-foreground">{erro}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Meus Ingressos</h1>
        <p className="text-sm text-muted-foreground">
          Veja seus ingressos em aberto e o histórico de jogos já utilizados.
        </p>
      </header>

      <Card className="overflow-hidden rounded-2xl">
        <CardHeader className="p-0">
          <TabsIngresso active={abaAtiva} onChange={setAbaAtiva} />
        </CardHeader>

        <CardContent className="p-4">
          {naoTemIngresso && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Você ainda não possui ingressos. Quando comprar um, ele vai
              aparecer aqui.
            </div>
          )}

          {!naoTemIngresso && listaVisivel.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Nenhum ingresso nesta aba no momento.
            </div>
          )}

          {!naoTemIngresso && listaVisivel.length > 0 && (
            <ul className="space-y-4">
              {listaVisivel.map((ingresso) => (
                <li key={ingresso.id}>
                  <Link href={`/ingressos/${ingresso.id}`}>
                    <CardIngresso ingresso={ingresso} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="mt-4">
        <Chevron currentPage={1} totalPages={1} />
      </div>
    </main>
  );
}
