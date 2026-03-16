import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IPlano, Periodicidade } from "@/app/types/planoItf";

type FaixaDePlanoProps = {
  plano: IPlano;
};

const periodicidadeLabel: Record<Periodicidade, string> = {
  MENSAL: "mês",
  TRIMESTRAL: "trimestre",
  SEMESTRAL: "semestre",
  ANUAL: "ano",
};

export function FaixaDePlano({ plano }: FaixaDePlanoProps) {
  const precoBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(plano.valor);

  return (
    <Card className="flex h-[220px] flex-col justify-between rounded-2xl border-border/70 bg-card/80 backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="line-clamp-2 text-xl font-bold leading-snug">
            {plano.nome}
          </CardTitle>

          <CardDescription className="text-base font-semibold text-foreground">
            {precoBRL}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              /{periodicidadeLabel[plano.periodicidade]}
            </span>
          </CardDescription>
        </div>

        {plano.descricao && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {plano.descricao}
          </p>
        )}
      </CardHeader>

      <CardFooter>
        <Button asChild className="w-full" size="lg">
          <Link href="/planos">Ver benefícios</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}