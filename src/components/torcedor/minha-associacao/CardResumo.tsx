"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AssociacaoData {
  planoId: string | null;
  planoNome: string | null;
  descricao?: string | null;
  status: "ATIVA" | "PENDENTE" | "CANCELADA" | "SEM_PLANO";
  valor: number | null;
  periodicidade: "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL" | null;
  dataInicio?: string | null;
  proximaCobranca?: string | null;
  matricula: string;
  numeroCartao?: string | null;
  nomeSocio: string;
}

interface CardResumoProps {
  associacao: AssociacaoData;
}

export function CardResumo({ associacao }: CardResumoProps) {
  function getStatusColor(status: string) {
    switch (status) {
      case "ATIVA":
        return "bg-green-500/20 text-green-400";
      case "PENDENTE":
        return "bg-yellow-500/20 text-yellow-400";
      case "CANCELADA":
        return "bg-red-500/20 text-red-400";
      case "SEM_PLANO":
      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>{associacao.planoNome}</CardTitle>
            <CardDescription>
              {associacao.descricao ?? "Detalhes da sua associação ativa."}
            </CardDescription>
          </div>

          <Badge className={getStatusColor(associacao.status)}>
            {associacao.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className=" gap-6 flex justify-between flex-wrap">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">
              Valor
            </p>
            <p className="font-semibold">
              R$ {associacao.valor?.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">
              Periodicidade
            </p>
            <p className="font-semibold">
              {associacao.periodicidade === "MENSAL" && "Mensal"}
              {associacao.periodicidade === "TRIMESTRAL" && "Trimestral"}
              {associacao.periodicidade === "SEMESTRAL" && "Semestral"}
              {associacao.periodicidade === "ANUAL" && "Anual"}
            </p>
          </div>

          <div>
            {associacao.dataInicio && (
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">
                  Data de Início
                </p>
                <p className="font-semibold">
                  {formatDate(associacao.dataInicio)}
                </p>
              </div>
            )}
          </div>

          <div>
            {associacao.proximaCobranca && (
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">
                  Próxima Cobrança
                </p>
                <p className="font-semibold">
                  {formatDate(associacao.proximaCobranca)}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
