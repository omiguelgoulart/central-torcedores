"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

import type { IPlano } from "@/app/types/planoItf";
import type { IBeneficio } from "@/app/types/beneficioItf";

interface ResumoPlanoProps {
  plano: IPlano;
}

export function ResumoPlano({ plano }: ResumoPlanoProps) {
  const beneficios: IBeneficio[] = Array.isArray(plano.beneficios)
    ? plano.beneficios
    : [];

  return (
    <Card className="mb-6">
      {/* Cabeçalho */}
      <CardHeader className="">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{plano.nome}</CardTitle>
            {plano.descricao && (
              <p className="mt-1">{plano.descricao}</p>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Conteúdo */}
      <CardContent className="space-y-">
        <div>
          <h3 className="font-semibold text-lg mb-4">Benefícios inclusos:</h3>

          {beneficios.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum benefício listado para este plano.
            </p>
          ) : (
            <ul className="space-y-3">
              {beneficios.map((beneficio) => (
                <li key={beneficio.id} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{beneficio.titulo}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
