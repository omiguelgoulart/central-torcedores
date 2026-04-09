"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapaEstadio, SetorCompleto } from "./MapaEstadio";
import { CardSetor } from "./CardSetor";
export type ValorLote = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  disponibilidade: number;
  tipo: string;
  inicioVendas: string | null;
  fimVendas: string | null;
  limitePorCPF: number | null;
};

export type ValorSetor = {
  id: string;
  nome: string;
  preco: number;
  capacidade: number;
  disponibilidade: number;
  setorId: string;
  jogoSetorId: string;
  loteId: string;
  aberto: boolean;
  box: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  lotes: ValorLote[];
};

interface ExibicaoMapaSetorProps {
  jogoId: string;
  valores: ValorSetor[];
}

const titulo = "Visual do Estádio Bento Freitas";

export function ExibicaoMapaSetor({ jogoId, valores }: ExibicaoMapaSetorProps) {
  const [selecionado, setSelecionado] = useState<SetorCompleto | null>(null);

  const setoresAbertos = useMemo(() => {
    return valores.filter((setor) => setor.aberto === true);
  }, [valores]);

  return (
    <section className="space-y-6">
      <Card className="w-full border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-muted-foreground">
            {titulo}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap justify-around gap-6 md:flex-nowrap">
          <MapaEstadio
            className="w-full md:w-1/2"
            valores={setoresAbertos}
            selecionadoId={selecionado?.id ?? null}
            onSelect={(setor) => setSelecionado(setor as SetorCompleto)}
          />

          <div className="mx-auto w-full md:mx-0 md:w-1/2">
            {selecionado ? (
              <CardSetor
                jogoId={jogoId}
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
