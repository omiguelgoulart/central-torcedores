"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ingressoItf } from "@/app/types/ingressoItf";

interface CardIngressoProps {
  ingresso: ingressoItf;
  showActions?: boolean; // se quiser esconder o botão depois
}

function formatarDataHora(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function formatarValor(valor: string) {
  const num = parseFloat(valor || "0");
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const statusConfig: Record<
  ingressoItf["status"],
  { label: string; badgeClass: string }
> = {
  VALIDO: { label: "VÁLIDO", badgeClass: "bg-emerald-100 text-emerald-700" },
  USADO: { label: "USADO", badgeClass: "bg-blue-100 text-blue-700" },
  CANCELADO: { label: "CANCELADO", badgeClass: "bg-red-100 text-red-700" },
};

export function CardIngresso({ ingresso }: CardIngressoProps) {
  const statusInfo = statusConfig[ingresso.status];
  const tituloJogo = `${ingresso.jogo.nome}`;

  return (
    <Card >
      <CardContent className="px-5 py-4">
        <div className="flex flex-row items-center gap-4">
          {/* Esquerda – jogo */}
          <div className="flex-1 min-w-0">
            <p className="mt-1 text-sm font-semibold text-foreground truncate">
              {tituloJogo}
            </p>
            <p className="text-xs text-muted-foreground">
              Jogo: {formatarDataHora(ingresso.jogo.dataHora)}
            </p>
          </div>

          <div className="flex flex-col gap-2 items-centrer justify-center">
            <div className="flex justify-end ">
            <Badge className={` ${statusInfo.badgeClass}`}>
             {statusInfo.label}
            </Badge>

            </div>

          

          <div className="flex flex-col items-end justify-between gap-2 min-w-[140px]">
            <div className="flex items-baseline gap-3">
              <p className="text-xs text-muted-foreground uppercase">Total</p>
              <p className="text-base font-semibold text-foreground">
                {formatarValor(ingresso.valor)}
              </p>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Compra: {formatarDataHora(ingresso.criadoEm)}</span>
            </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
