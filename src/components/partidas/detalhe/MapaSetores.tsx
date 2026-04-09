"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardSetor } from "./CardSetor";
import { ValorSetor } from "./ExibicaoMapaSetor";

const RATIO = 1000 / 800;

interface MapaSetoresProps {
  partidaId: string;
  setores: ValorSetor[];
}

export function MapaSetores({ partidaId, setores }: MapaSetoresProps) {
  const [selecionado, setSelecionado] = useState<ValorSetor | null>(null);

  const setoresAbertos = setores.filter((setor) => setor.aberto !== false);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Mapa de Setores</h2>

      <Card className="w-full border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-muted-foreground">
            Visual do Estádio Bento Freitas
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 items-start md:grid-cols-[1.4fr_1fr]">
          <div
            className={`relative mx-auto overflow-hidden rounded-xl border bg-muted/40 transition-all duration-300 md:mx-0 ${
              selecionado
                ? "md:ml-0"
                : "md:col-span-2 md:flex md:justify-center"
            }`}
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: `${RATIO}` }}
            >
              <Image
                src="/stadium-map.png"
                alt="Mapa do Estádio Bento Freitas"
                fill
                className="pointer-events-none z-0 object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />

              <TooltipProvider delayDuration={100}>
                {setoresAbertos.map((setor) => (
                  <Tooltip key={setor.jogoSetorId}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Selecionar ${setor.nome}`}
                        onClick={() => setSelecionado(setor)}
                        className={`absolute z-20 cursor-pointer rounded-md outline-none transition-all ${
                          selecionado?.jogoSetorId === setor.jogoSetorId
                            ? "bg-primary/10 ring-2 ring-primary/60"
                            : "hover:bg-primary/10"
                        }`}
                        style={{
                          left: `${setor.box.left}%`,
                          top: `${setor.box.top}%`,
                          width: `${setor.box.width}%`,
                          height: `${setor.box.height}%`,
                        }}
                      />
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      align="center"
                      className="px-3 py-1.5"
                    >
                      <p className="text-sm font-medium">{setor.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {setor.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}{" "}
                        · {setor.disponibilidade} lugares
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ${
              selecionado
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0"
            }`}
          >
            {selecionado ? (
              <CardSetor
                jogoId={partidaId}
                setor={selecionado}
                onCancel={() => setSelecionado(null)}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
