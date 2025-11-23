"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Jogo {
  id: string;
  nome: string;
  data: string; // ISO
  local: string;
  descricao?: string;
  status?: "disponível" | "esgotado" | "encerrado" | string;
}

export function JogoCard({ jogo }: { jogo: Jogo }) {
  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>{jogo.nome}</CardTitle>
        {jogo.status && (
          <CardDescription className="text-xs">{jogo.status}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{new Date(jogo.data).toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{jogo.local}</span>
          </div>
        </div>
        <Link href={`/partidas/${jogo.id}`} className="block">
          <Button className="w-full rounded-xl">Comprar ingressos</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
