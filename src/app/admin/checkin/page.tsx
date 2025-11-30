"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type JogoLista = {
  id: string;
  nome: string;
  data: string;
  local: string;
};

function ordenarPorDataAsc(jogos: JogoLista[]): JogoLista[] {
  return [...jogos].sort((a, b) => {
    const da = new Date(a.data).getTime();
    const db = new Date(b.data).getTime();
    return da - db;
  });
}

export default function CheckinJogosPage() {
  const [jogos, setJogos] = useState<JogoLista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API}/admin/jogo`);
        if (!response.ok) {
          setError("Não foi possível carregar os jogos disponíveis.");
          setLoading(false);
          return;
        }

        const data = (await response.json()) as JogoLista[];

        const agora = new Date().getTime();

        const futuros = data.filter((jogo) => {
          const t = new Date(jogo.data).getTime();
          return t >= agora - 3 * 60 * 60 * 1000; // tolerância de algumas horas
        });

        setJogos(ordenarPorDataAsc(futuros));
      } catch {
        setError("Erro ao carregar a lista de jogos.");
      } finally {
        setLoading(false);
      }
    };

    void carregar();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-2xl space-y-4">
        <Card className="w-full rounded-2xl shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ticket className="w-5 h-5" />
              <span>Check-in de ingressos</span>
            </CardTitle>
            <CardDescription>
              Selecione o jogo para iniciar o check-in dos ingressos na portaria.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading && (
              <p className="text-sm text-muted-foreground">
                Carregando jogos disponíveis...
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {!loading && !error && jogos.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum jogo disponível para check-in no momento.
              </p>
            )}

            {!loading && !error && jogos.length > 0 && (
              <div className="space-y-3">
                {jogos.map((jogo) => (
                  <Card
                    key={jogo.id}
                    className="border border-muted-foreground/10"
                  >
                    <CardContent className="py-3 px-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {jogo.nome}
                          </span>
                          <Badge variant="outline" className="text-[11px]">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            {new Date(jogo.data).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{jogo.local}</span>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0">
                        <Button size="sm" asChild>
                          <Link href={`/admin/checkin/${jogo.id}`}>
                            Iniciar check-in
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
