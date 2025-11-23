"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapaEstadio, SetorCompleto } from "./MapaEstadio";
import { CardSetor } from "./CardSetor";

type ExibicaoMapaSetorProps = {
  partidaId: string;
  valores: Array<{ id: string; preco: number; disponibilidade: number; nome?: string }>;
  titulo?: string;
};

export function ExibicaoMapaSetor({
  partidaId,
  valores,
  titulo = "Visual do Estádio Bento Freitas",
}: ExibicaoMapaSetorProps) {
  const [selecionado, setSelecionado] = useState<SetorCompleto | null>(null);

  return (
    <section className="space-y-6">
      <Card className="w-full border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-muted-foreground">{titulo}</CardTitle>
        </CardHeader>

        {/* Mapa menor + painel um pouco mais estreito */}
        <CardContent className="flex flex-col md:flex-row flex-wrap gap-6 items-center md:items-start justify-center">
          {/* limite de largura do mapa por breakpoint */}
          <MapaEstadio
            className="w-full self-start md:max-w-[680px] lg:max-w-[600px] xl:max-w-[560px]"
            valores={valores}
            selecionadoId={selecionado?.id ?? null}
            onSelect={setSelecionado}
          />

          <div className="w-full max-w-[380px] mx-auto md:mx-0">
            {selecionado ? (
              <CardSetor
          partidaId={partidaId}
          setor={selecionado}
          onCancel={() => setSelecionado(null)}
              />
            ) : (
              <Card className="border border-border/50 bg-background/60 backdrop-blur-sm">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Selecione um setor no mapa para ver detalhes e avançar.
          </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
