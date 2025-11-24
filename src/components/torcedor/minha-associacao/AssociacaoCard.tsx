"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AssociacaoStatus } from "./AssociacaoStatus";

interface AssociacaoData {
  planoId: string | null;
  planoNome: string | null;
  descricao?: string | null;
  status: "ATIVA" | "PENDENTE" | "CANCELADA" | "SEM_PLANO";
  valor: number | null;
  periodicidade: "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL" | null;
  dataInicio?: string | null;
  proximaCobranca?: string | null;
}

export function AssociacaoCard({ associacao }: { associacao: AssociacaoData }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ATIVA":
        return "bg-green-500/20 text-green-400";
      case "PENDENTE":
        return "bg-yellow-500/20 text-yellow-400";
      case "CANCELADA":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">{associacao.planoNome}</CardTitle>
            <CardDescription>{associacao.descricao}</CardDescription>
          </div>
          <Badge className={getStatusColor(associacao.status)}>
            {associacao.status}
          </Badge>
        </div>
      </CardHeader>

      <Separator className="bg-zinc-800" />

      <CardContent className="px-6 pt-6 space-y-6">
        <AssociacaoStatus
          valor={associacao.valor}
          periodicidade={associacao.periodicidade}
          dataInicio={associacao.dataInicio}
          proximaCobranca={associacao.proximaCobranca}
        />
      </CardContent>
    </Card>
  );
}
