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

interface Jogo {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao?: string;
}

interface FaixaDeJogosProps {
  jogo: Jogo;
}

export function FaixaDeJogos({ jogo }: FaixaDeJogosProps) {
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
    <Card className="h-full">
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
          <Link href={`/partidas/${jogo.id}`}>Ver ingressos</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}