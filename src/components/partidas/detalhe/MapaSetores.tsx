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

// 🏟️ Setores (ajuste os boxes conforme sua imagem)
const setores = [
  {
    id: "jk",
    nome: "Arquibancada JK (Juscelino)",
    preco: 50,
    disponibilidade: 150,
    box: { left: 18, top: 17, width: 60, height: 12 }, // topo
  },
  {
    id: "social",
    nome: "Arquibancada Social",
    preco: 80,
    disponibilidade: 90,
    box: { left: 18, top: 72, width: 60, height: 10 }, // baixo
  },
  {
    id: "cativas",
    nome: "Cadeiras Cativas",
    preco: 120,
    disponibilidade: 30,
    box: { left: 60.5, top: 82, width: 18, height: 8 }, // faixa abaixo
  },
  {
    id: "norte",
    nome: "Arquibancada Norte",
    preco: 40,
    disponibilidade: 100,
    box: { left: 12, top: 30, width: 10, height: 45 }, // esquerda
  },
  {
    id: "norte-visitante",
    nome: "Arquibancada Norte",
    preco: 40,
    disponibilidade: 100,
    box: { left: 12, top: 30, width: 10, height: 45 }, // esquerda
  },
  {
    id: "sul",
    nome: "Arquibancada Sul",
    preco: 40,
    disponibilidade: 100,
    box: { left: 75, top: 32, width: 10, height: 45 }, // direita
  },
] as const;

// proporção real da imagem
const RATIO = 1000 / 800;

type SetorMapa = (typeof setores)[number];

export function MapaSetores({ partidaId }: { partidaId: string }) {
  const [selecionado, setSelecionado] = useState<SetorMapa | null>(null);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Mapa de Setores</h2>

      <Card className="w-full border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-muted-foreground">
            Visual do Estádio Bento Freitas
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-[1.4fr_1fr] gap-6 items-start">
          {/* 🗺️ MAPA */}
          <div
            className={`relative rounded-xl overflow-hidden border bg-muted/40 mx-auto md:mx-0 transition-all duration-300 ${
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
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />

              {/* hotspots clicáveis */}
              <TooltipProvider delayDuration={100}>
                {setores.map((s) => (
                  <Tooltip key={s.id}>
                    <TooltipTrigger asChild>
                      <button
                        aria-label={`Selecionar ${s.nome}`}
                        onClick={() => setSelecionado(s)}
                        className={`absolute rounded-md transition-all outline-none
                          ${
                            selecionado?.id === s.id
                              ? "ring-2 ring-primary/60 bg-primary/10"
                              : "hover:bg-primary/10"
                          }`}
                        style={{
                          left: `${s.box.left}%`,
                          top: `${s.box.top}%`,
                          width: `${s.box.width}%`,
                          height: `${s.box.height}%`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="px-3 py-1.5"
                    >
                      <p className="font-medium text-sm">{s.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}{" "}
                        · {s.disponibilidade} lugares
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          {/* ✅ CARD CONFIRMAÇÃO */}
          <div
            className={`transition-all duration-300 ${
              selecionado
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            {selecionado ? (
              <CardSetor
                jogoId={partidaId}
                setor={{
                  // mapeia o mock pro formato esperado pelo CardSetor
                  jogoSetorId: selecionado.id,
                  setorId: selecionado.id,
                  nome: selecionado.nome,
                  preco: selecionado.preco,
                  disponibilidade: selecionado.disponibilidade,
                  loteId: "", // mock: sem lote real aqui
                }}
                onCancel={() => setSelecionado(null)}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
