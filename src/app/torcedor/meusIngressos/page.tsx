"use client";

import { useEffect, useMemo, useState } from "react";
import { ingressoItf } from "@/app/types/ingressoItf";
import { Chevron } from "@/components/torcedor/meusIngressos/ChevronIngresso";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CardIngresso } from "@/components/torcedor/meusIngressos/CardIngresso";
import Link from "next/link";
import Cookies from "js-cookie";
import { AbaIngresso, TabsIngresso } from "@/components/torcedor/meusIngressos/TabsIngressos";


export default function IngressosPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaIngresso>("PROXIMOS");
  const [ingressos, setIngressos] = useState<ingressoItf[]>([]);
  const [loading, setLoading] = useState(true);

  const torcedorId = Cookies.get("usuarioId") || Cookies.get("id"); 

  useEffect(() => {
    async function load() {
      try {
        if (!torcedorId) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/usuario/${torcedorId}`
        );

        const data = await res.json();

        if (data?.ingressos) {
          setIngressos(data.ingressos);
        }
      } catch (e) {
        console.error("Erro ao buscar ingressos:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [torcedorId]);

  
    const agora = useMemo(() => new Date(), []);
  
    const proximos = useMemo(
      () =>
        ingressos.filter((ing) => {
          const dataJogo = ing.jogo?.dataHora
            ? new Date(ing.jogo.dataHora)
            : null;
  
          return (
            dataJogo && dataJogo >= agora && ing.status === "VALIDO"
          );
        }),
      [ingressos, agora]
    );
  
    const anteriores = useMemo(
      () =>
        ingressos.filter((ing) => {
          const dataJogo = ing.jogo?.dataHora
            ? new Date(ing.jogo.dataHora)
            : null;
  
          return !dataJogo || dataJogo < agora || ing.status !== "VALIDO";
        }),
      [ingressos, agora]
    );
  
    const listaVisivel = abaAtiva === "PROXIMOS" ? proximos : anteriores;
    const naoTemIngresso = ingressos.length === 0;
  
    if (loading) {
      return (
        <main className="min-h-screen px-4 py-8">
          <p className="text-center text-muted-foreground">Carregando ingressos...</p>
        </main>
      );
    }
  
    return (
      <main className="min-h-screen">
        {/* HEADER */}
        <header className="mb-6 space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Meus Ingressos</h1>
          <p className="text-sm text-muted-foreground">
            Veja seus ingressos em aberto e o histórico de jogos já utilizados.
          </p>
        </header>

        {/* CARD */}
        <Card className="overflow-hidden rounded-2xl">
          <CardHeader className="p-0">
            <TabsIngresso active={abaAtiva} onChange={setAbaAtiva} />
          </CardHeader>

          <CardContent className="p-4">
            {naoTemIngresso && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Você ainda não possui ingressos. Quando comprar um, ele vai aparecer aqui.
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
                  <li key={ingresso.id} className="list-none">
                    <Link href={`/ingressos/${ingresso.id}`}>
                      <CardIngresso ingresso={ingresso} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        <div className="mt-4">
          <Chevron currentPage={1} totalPages={1} />
        </div>
      </main>
  );
}
