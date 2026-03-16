"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Jogo {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao?: string;
  status?: string;
}

interface FaixaDeJogosProps {
  jogos: Jogo[];
}

export function FaixaDeJogos({ jogos }: FaixaDeJogosProps) {
  const agora = new Date();

  const jogosFuturos = jogos
    .filter((jogo) => new Date(jogo.data) > agora)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (jogosFuturos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <ScrollArea className="w-full whitespace-nowrap rounded-2xl">
        <div className="flex gap-4 pb-4 pt-1">
          {jogosFuturos.map((jogo) => {
            const dataObj = new Date(jogo.data);

            const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={jogo.id}
                className="w-[280px] min-w-[280px] flex-shrink-0 sm:w-[300px] sm:min-w-[300px] "
              >
                <CardHeader className="space-y-3">
                  <CardTitle className="line-clamp-2 text-xl font-bold leading-snug">
                    {jogo.nome}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {jogo.descricao}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{dataFormatada}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{horaFormatada}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{jogo.local}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/partidas">Ver ingressos</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
