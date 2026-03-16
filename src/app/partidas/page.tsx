"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListaJogos } from "@/components/partidas/ListaJogos";
import { PartidasLoadingSkeleton } from "@/components/partidas/PartidasLoadingSkeleton";
import type { Jogo } from "@/components/partidas/CardJogo";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export default function PartidasPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);

        const res = await fetch(`${API}/admin/jogo?page=${page}&limit=10`, {
    cache: "no-store"
});

        if (!res.ok) throw new Error("Erro ao buscar jogos");

        const data = await res.json();
        if (Array.isArray(data)) {
          setJogos(data);
          setTotalPages(1);
          return;
        }

        setJogos(Array.isArray(data?.jogos) ? data.jogos : []);
        setTotalPages(Number.isFinite(data?.totalPages) ? data.totalPages : 1);
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [page]);

  return (
    <main className="min-h-screen flex flex-col">
      <section
        className="w-full h-58 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/torcida.jpeg')" }}
      />

      <section className="p-4">
        {loading ? (
          <PartidasLoadingSkeleton />
        ) : (
          <div className="mt-6">
            <Card className="mx-auto border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Próximas Partidas
                </CardTitle>
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="self-center text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <ListaJogos jogos={jogos} />
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
