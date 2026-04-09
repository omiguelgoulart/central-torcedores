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
    return torcedor?.ingressos ?? [];
  }, [torcedor]);

  const proximos = useMemo(() => {
    const agora = new Date();
    return ingressos.filter((ing) => {
      const dataJogo = ing.jogo?.data ? new Date(ing.jogo.data) : null;
      const isValido = ing.status === "VALIDO";

      if (!dataJogo) return isValido;

      return isValido && dataJogo >= agora;
    });
  }, [ingressos]);

  const anteriores = useMemo(() => {
    return ingressos.filter((ing) => !proximos.some((p) => p.id === ing.id));
  }, [ingressos, proximos]);

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
