"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// 👉 importe suas interfaces
import { IBeneficio } from "@/app/types/beneficioItf";
import { IPlano, Periodicidade } from "@/app/types/planoItf";

/** 🎨 Paleta inspirada no Brasil de Pelotas
 * Vermelho: #C8102E
 * Preto: #121212
 * Dourado (detalhes premium): #D4AF37
 * Branco: #FFFFFF
 */

type Variant =
  | "torcedor"
  | "arquibancada"
  | "cadeira"
  | "camarote"
  | "conselheiro";

const variantStyles: Record<Variant, string> = {
  torcedor: "border-neutral-800 bg-[#121212] hover:border-[#C8102E]/60",
  arquibancada: "border-[#C8102E]/50 bg-[#1A1A1A] hover:border-[#C8102E]/80",
  cadeira:
    "border-[#C8102E]/60 bg-[#1A1A1A] hover:border-[#C8102E]/90 ring-1 ring-[#C8102E]/30",
  camarote: "border-[#D4AF37]/50 bg-[#181818] hover:border-[#D4AF37]/80",
  conselheiro:
    "border-[#C8102E]/70 bg-[#121212] hover:border-[#C8102E] ring-1 ring-[#C8102E]/40",
};

const variantBadges: Record<Variant, string> = {
  torcedor: "bg-[#C8102E]/20 text-white border-[#C8102E]/40",
  arquibancada: "bg-[#C8102E]/20 text-white border-[#C8102E]/40",
  cadeira: "bg-[#C8102E]/20 text-white border-[#C8102E]/40",
  camarote: "bg-[#D4AF37]/30 text-[#D4AF37] border-[#D4AF37]/40",
  conselheiro: "bg-[#C8102E]/30 text-white border-[#C8102E]/40",
};

const variantButtons: Record<Variant, string> = {
  torcedor: "bg-[#C8102E] hover:bg-[#E01F3D] text-white",
  arquibancada: "bg-[#C8102E] hover:bg-[#E01F3D] text-white",
  cadeira: "bg-[#C8102E] hover:bg-[#E01F3D] text-white",
  camarote: "bg-[#D4AF37] hover:bg-[#E6C85C] text-black",
  conselheiro: "bg-[#C8102E] hover:bg-[#E01F3D] text-white",
};

// ---------- PROPS ----------
export interface CardPlanoProps {
  plano: IPlano; // objeto do seu domínio
  variant: Variant; // visual
  featured?: boolean; // destaque visual (opcional)
  beneficiosOverride?: IBeneficio[]; // se quiser substituir os benefícios do plano
}
// ---------------------------

const periodicidadeLabel: Record<Periodicidade, string> = {
  MENSAL: "mês",
  TRIMESTRAL: "trimestre",
  SEMESTRAL: "semestre",
  ANUAL: "ano",
};

export function CardPlano({
  plano,
  variant,
  featured = false,
  beneficiosOverride,
}: CardPlanoProps) {
  const router = useRouter();

  const beneficios = Array.isArray(beneficiosOverride)
    ? beneficiosOverride
    : Array.isArray(plano?.beneficios)
    ? plano.beneficios
    : [];

  const precoBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(plano.valor);

  const handleSubscribe = () => {
    const params = new URLSearchParams({
      plan: plano.nome,
      price: String(plano.valor),
      period: plano.periodicidade,
      planId: plano.id,
    });
    router.push(`/assinatura?${params.toString()}`);
  };

  return (
    <Card
      className={cn(
        "relative flex flex-col border transition-all duration-300 hover:shadow-lg hover:shadow-[#C8102E]/30",
        variantStyles[variant],
        (featured || plano.isFeatured) &&
          "scale-105 border-[#C8102E] shadow-xl shadow-[#C8102E]/40"
      )}
    >
      {(featured || plano.isFeatured) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            className={cn(
              "px-4 py-1 text-sm font-medium",
              variantBadges[variant]
            )}
          >
            {plano.badgeLabel ?? "Mais Popular"}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          {plano.nome}
        </CardTitle>
        <CardDescription className="mt-4">
          <span className="text-4xl font-bold text-white">{precoBRL}</span>
          <span className="text-neutral-400">
            /{periodicidadeLabel[plano.periodicidade]}
          </span>
        </CardDescription>
        {!!plano.descricao && (
          <p className="mt-2 text-sm text-neutral-300">{plano.descricao}</p>
        )}
      </CardHeader>

      <Separator className="mx-6 bg-neutral-800" />

      <CardContent className="flex-1 pt-6">
        <ul className="space-y-3">
          {beneficios.length === 0 ? (
            <li className="text-sm text-neutral-400">
              Nenhum benefício listado
            </li>
          ) : (
            beneficios.map((b, i) => (
              <li key={(b as any)?.id ?? i} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C8102E]" />
                <span className="text-sm text-neutral-200">
                  {(b as any)?.titulo}
                </span>
              </li>
            ))
          )}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubscribe}
          className={cn("w-full", variantButtons[variant])}
          size="lg"
        >
          Assinar agora
        </Button>
      </CardFooter>
    </Card>
  );
}
