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
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import type { IBeneficio } from "@/app/types/beneficioItf";
import type { IPlano, Periodicidade } from "@/app/types/planoItf";

export interface CardPlanoProps {
  plano: IPlano;
  beneficiosOverride?: IBeneficio[];
}

const periodicidadeLabel: Record<Periodicidade, string> = {
  MENSAL: "mês",
  TRIMESTRAL: "trimestre",
  SEMESTRAL: "semestre",
  ANUAL: "ano",
};

export function CardPlano({ plano, beneficiosOverride }: CardPlanoProps) {
  const router = useRouter();

  const beneficios: IBeneficio[] = Array.isArray(beneficiosOverride)
    ? beneficiosOverride
    : Array.isArray(plano.beneficios)
    ? plano.beneficios
    : [];

  const precoBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(plano.valor);

function onSubmit() {
  const params = new URLSearchParams({
    planoId: plano.id,
    planoNome: plano.nome,
    valor: String(plano.valor),
    defaultRecorrencia: plano.periodicidade,
  });

  const url = `/assinatura?${params.toString()}`;
  console.log("Indo para URL:", url);

  router.push(url);
}

  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">{plano.nome}</CardTitle>

        <CardDescription className="mt-2 text-lg font-semibold">
          {precoBRL}
          <span className="text-muted-foreground ml-1">
            /{periodicidadeLabel[plano.periodicidade]}
          </span>
        </CardDescription>

        {plano.descricao && (
          <p className="text-sm text-muted-foreground mt-2">
            {plano.descricao}
          </p>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 flex-1">
        <ul className="space-y-2">
          {beneficios.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Nenhum benefício listado.
            </li>
          ) : (
            beneficios.map((beneficio) => (
              <li key={beneficio.id} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm">{beneficio.titulo}</span>
              </li>
            ))
          )}
        </ul>
      </CardContent>

      <CardFooter>
        <Button onClick={onSubmit} className="w-full" size="lg">
          Assinar agora
        </Button>
      </CardFooter>
    </Card>
  );
}
