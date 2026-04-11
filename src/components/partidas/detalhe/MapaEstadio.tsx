"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ValorSetor } from "./ExibicaoMapaSetor";
import { getBoxMapa } from "./mapaBoxes";

const RATIO = 1000 / 800;

type MapaEstadioProps = {
  valores: ValorSetor[];
  selecionadoId: string | null;
  onSelect: (setor: ValorSetor) => void;
  className?: string;
};

export function MapaEstadio({
  valores,
  selecionadoId,
  onSelect,
  className,
}: MapaEstadioProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-muted/40",
        className,
      )}
    >
      <div className="relative w-full" style={{ aspectRatio: `${RATIO}` }}>
        <Image
          src="/stadium-map.png"
          alt="Mapa do Estádio Bento Freitas"
          fill
          className="pointer-events-none z-0 object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />

        <TooltipProvider delayDuration={100}>
          {valores.map((setor, index) => {
            const menorPreco =
              setor.lotes.length > 0
                ? Math.min(...setor.lotes.map((lote) => lote.preco))
                : setor.preco;

            const estaSelecionado = selecionadoId === setor.jogoSetorId;
            const box = getBoxMapa(
              setor.nome,
              index,
              valores.length,
              setor.box,
            );

            return (
              <Tooltip key={setor.jogoSetorId}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Selecionar ${setor.nome}`}
                    onClick={() => onSelect(setor)}
                    className={cn(
                      "absolute z-20 cursor-pointer rounded-md outline-none transition-all",
                      estaSelecionado
                        ? "bg-primary/10 ring-2 ring-primary/60"
                        : "hover:bg-primary/10",
                    )}
                    style={{
                      left: `${box.left}%`,
                      top: `${box.top}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
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
                    A partir de{" "}
                    {menorPreco.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    · {setor.disponibilidade} lugares
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
