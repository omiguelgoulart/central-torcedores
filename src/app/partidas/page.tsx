"use client";

import { useEffect, useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ListaJogos } from "@/components/partidas/ListaJogos";
import { PartidasLoadingSkeleton } from "@/components/partidas/PartidasLoadingSkeleton";
import useJogo from "@/hooks/useJogo";
import { JogoItf } from "@/app/types/jogoItf";

export default function PartidasPage() {
  const { jogos, loading, error, fetchJogos } = useJogo();

  useEffect(() => {
    fetchJogos();
  }, [fetchJogos]);

  const jogosLista = useMemo<JogoItf[]>(() => {
    if (!jogos) return [];

    const agora = new Date();
    return jogos.filter((jogo) => new Date(jogo.data) >= agora);
  }, [jogos]);

  return (
    <main className="min-h-screen flex flex-col">
      <section
        className="relative h-58 w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/torcida.jpeg')" }}
      />

      <section className="p-4">
        {loading ? (
          <PartidasLoadingSkeleton />
        ) : error ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : (
          <div className="mt-6">
            <h1 className="text-2xl font-bold mb-4">Próximas Partidas</h1>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <ListaJogos jogos={jogosLista} />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </section>
    </main>
  );
}
