"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, CreditCard } from "lucide-react";

import { ClubeFooter } from "@/components/home/ClubeFooter";
import { FaixaDeJogos } from "@/components/home/FaixaDeJogo";
import { HomeLoadingSkeleton } from "@/components/home/HomeLoadingSkeleton";
import { Perguntas } from "@/components/home/Perguntas";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import usePlano from "@/hooks/usePlano";
import useJogo from "@/hooks/useJogo";

import { IPlano } from "./types/planoItf";
import { JogoItf } from "./types/jogoItf";
import { FaixaDePlano } from "@/components/home/FaixaDePlano";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);

  const { planos, fetchPlanos } = usePlano();
  const { jogos, fetchProximosJogos } = useJogo();

  const jogosList: JogoItf[] = jogos ?? [];
  const planosList: IPlano[] = planos ?? [];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        await Promise.all([fetchProximosJogos(), fetchPlanos()]);
      } catch (error) {
        console.error("Erro ao carregar dados da home:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [fetchProximosJogos, fetchPlanos]);

  const faqs = [
    {
      pergunta: "Como compro meia-entrada?",
      resposta: "Selecione a opção e apresente documento na entrada.",
    },
    {
      pergunta: "Posso transferir ingresso?",
      resposta: "Em breve. No momento, o ingresso é pessoal.",
    },
    {
      pergunta: "Como troco de plano?",
      resposta: "Acesse sua conta e vá em Assinatura > Trocar Plano.",
    },
    {
      pergunta: "Quais formas de pagamento?",
      resposta: "Aceitamos cartão, boleto e PIX.",
    },
  ];

  const proximoJogo = jogosList[0];

  if (carregando) {
    return <HomeLoadingSkeleton />;
  }

  return (
    <>
      <main>
        <section className="relative h-[320px] w-full overflow-hidden rounded-b-2xl md:h-[380px]">
          <div className="absolute inset-0">
            <Image
              src="/football-stadium-crowd.jpg"
              alt="Estádio"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 flex h-full items-end">
            <div className="mx-auto flex w-full flex-col gap-3 px-4 py-8 md:px-6 md:py-10">
              <h1 className="max-w-3xl text-2xl font-bold leading-tight text-white drop-shadow md:text-4xl">
                {proximoJogo?.nome ?? "Confira os próximos jogos na Baixada"}
              </h1>

              <p className="max-w-2xl text-sm text-white/90 drop-shadow md:text-base">
                {proximoJogo?.descricao ??
                  "Garanta seu ingresso com antecedência."}
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push("/planos")}
                >
                  Ver planos de sócio
                </Button>

                <Button size="lg" onClick={() => router.push("/partidas")}>
                  Comprar ingresso
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full space-y-14 px-4 pb-20 pt-12 md:px-6">
          {jogosList.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-border/60 bg-card p-2">
                    <Calendar className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold md:text-3xl">
                      Próximos jogos
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Confira as próximas partidas e garanta seu ingresso.
                    </p>
                  </div>
                </div>

                <Button variant="link" asChild className="shrink-0">
                  <Link href="/partidas">Ver todos</Link>
                </Button>
              </div>
              <ScrollArea className="w-full whitespace-nowrap rounded-2xl">
                <div className="flex gap-4 pb-4 pt-1">
                  {jogosList.map((jogo) => (
                    <div
                      key={jogo.id}
                      className="w-[280px] min-w-[280px] flex-shrink-0 sm:w-[300px] sm:min-w-[300px]"
                    >
                      <FaixaDeJogos jogo={jogo} />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </section>
          )}

          {planosList.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-border/60 bg-card p-2">
                    <CreditCard className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold md:text-3xl">
                      Planos de Sócio
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Escolha o plano ideal e veja os benefícios disponíveis.
                    </p>
                  </div>
                </div>
                <Button variant="link" asChild className="shrink-0">
                  <Link href="/planos">Ver todos</Link>
                </Button>
              </div>

              <ScrollArea className="w-full whitespace-nowrap rounded-2xl">
                <div className="flex gap-4 pb-4 pt-1">
                  {planosList.map((plano) => (
                    <div
                      key={plano.id}
                      className="w-[280px] min-w-[280px] flex-shrink-0 sm:w-[300px] sm:min-w-[300px]"
                    >
                      <FaixaDePlano plano={plano} />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </section>
          )}

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Dúvidas frequentes
              </h2>
              <p className="text-sm text-muted-foreground">
                Encontre respostas rápidas sobre ingressos, planos e acesso.
              </p>
            </div>

            <Perguntas perguntas={faqs} />
          </section>
        </div>
      </main>

      <ClubeFooter />
    </>
  );
}
