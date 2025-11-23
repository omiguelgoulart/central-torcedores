"use client";

import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/** Tipos */
export type BoxPct = { left: number; top: number; width: number; height: number };
export type SetorBase = { id: string; nome: string; box: BoxPct };
export type SetorCompleto = SetorBase & { preco: number; disponibilidade: number };

export type ValorSetor = {
  id: string;
  preco: number;
  disponibilidade: number;
  nome?: string;
};

type MapaEstadioProps = {
  valores: ValorSetor[];
  selecionadoId?: string | null;
  onSelect?: (setor: SetorCompleto) => void;
  className?: string;
};

// proporção real da imagem (fixa)
const RATIO = 1000 / 800;

// imagem fixa
const IMAGE_SRC = "/stadium-map.png";

// layout fixo dos setores (posição e nome padrão)
const SETOR_LAYOUT: SetorBase[] = [
  { id: "jk",     nome: "Arquibancada JK (Juscelino)", box: { left: 18,   top: 17, width: 60,  height: 12 } },
  { id: "social", nome: "Arquibancada Social",         box: { left: 18,   top: 72, width: 60,  height: 10 } },
  { id: "cativas",nome: "Cadeiras Cativas",            box: { left: 63.5, top: 83, width: 18,  height: 8  } },
  { id: "norte",  nome: "Arquibancada Norte",          box: { left: 12,   top: 28, width: 10,  height: 50 } },
  { id: "sul",    nome: "Arquibancada Sul",            box: { left: 78,   top: 28, width: 10,  height: 50 } },
];

/** Merge: junta config fixa + valores dinâmicos */
function mesclarSetores(valores: ValorSetor[]): SetorCompleto[] {
  const mapaValores = new Map(valores.map(v => [v.id, v]));
  return SETOR_LAYOUT.map((base) => {
    const v = mapaValores.get(base.id);
    // valores default = 0 caso algum id não venha (evita quebra)
    return {
      id: base.id,
      nome: v?.nome ?? base.nome,
      box: base.box,
      preco: v?.preco ?? 0,
      disponibilidade: v?.disponibilidade ?? 0,
    };
  });
}

export function MapaEstadio({
  valores,
  selecionadoId,
  onSelect,
  className,
}: MapaEstadioProps) {
  const setores = mesclarSetores(valores);

  return (
    <div className={["relative rounded-xl overflow-hidden border bg-muted/40", className].filter(Boolean).join(" ")}>
      <div className="relative w-full" style={{ aspectRatio: `${RATIO}` }}>
        <Image
          src={IMAGE_SRC}
          alt="Mapa do Estádio"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />

        <TooltipProvider delayDuration={100}>
          {setores.map((s) => (
            <Tooltip key={s.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`Selecionar ${s.nome}`}
                  onClick={() => onSelect?.(s)}
                  className={[
                    "absolute rounded-md transition-all outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary/70",
                    selecionadoId === s.id
                      ? "ring-2 ring-primary/60 bg-primary/10"
                      : "hover:bg-primary/10",
                  ].join(" ")}
                  style={{
                    left: `${s.box.left}%`,
                    top: `${s.box.top}%`,
                    width: `${s.box.width}%`,
                    height: `${s.box.height}%`,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="px-3 py-1.5">
                <p className="font-medium text-sm">{s.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {s.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · {s.disponibilidade} lugares
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
