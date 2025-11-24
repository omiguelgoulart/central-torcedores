"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CarteirinhaSocio } from "@/components/torcedor/minhaAssociacao/CarteirinhaSocio";
import {
  ParcelaRegistro,
  TabelaPagamentosSocio,
} from "@/components/torcedor/minhaAssociacao/TablePagamento";
import { CardResumo } from "@/components/torcedor/minhaAssociacao/CardResumo";

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

const mockAssociacao: AssociacaoData = {
  planoId: "plan_campeao",
  planoNome: "Contribuinte Campeão do Mundo",
  descricao: "Plano com prioridade em jogos e benefícios exclusivos.",
  status: "ATIVA",
  valor: 68,
  periodicidade: "MENSAL",
  dataInicio: "2025-09-18",
  proximaCobranca: "2025-12-08",
  matricula: "0061174553",
  numeroCartao: "0010780923",
  nomeSocio: "Luis Miguel Rosa Goulart",
};

const mockParcelas: ParcelaRegistro[] = [
  // 2025
  {
    id: "p-2025-01",
    numeroParcela: "01/12",
    dataVencimento: "2025-09-18",
    valor: 68,
    status: "PAGO",
  },
  {
    id: "p-2025-02",
    numeroParcela: "02/12",
    dataVencimento: "2025-10-16",
    valor: 68,
    status: "PAGO",
  },
  {
    id: "p-2025-03",
    numeroParcela: "03/12",
    dataVencimento: "2025-11-16",
    valor: 68,
    status: "PAGO",
  },
  {
    id: "p-2025-04",
    numeroParcela: "04/12",
    dataVencimento: "2025-12-16",
    valor: 68,
    status: "A_VENCER",
  },
  {
    id: "p-2025-05",
    numeroParcela: "05/12",
    dataVencimento: "2026-01-16",
    valor: 68,
    status: "A_VENCER",
  },
  {
    id: "p-2025-06",
    numeroParcela: "06/12",
    dataVencimento: "2026-02-16",
    valor: 68,
    status: "A_VENCER",
  },
  // 2026 (exemplo extra)
  {
    id: "p-2026-07",
    numeroParcela: "07/12",
    dataVencimento: "2026-03-16",
    valor: 68,
    status: "A_VENCER",
  },
];

export default function AssociacaoPage() {
  const [associacao] = useState<AssociacaoData>(mockAssociacao);
  const [parcelas] = useState<ParcelaRegistro[]>(mockParcelas);

  if (associacao.status === "SEM_PLANO") {
    return (
      <div className="space-y-6">
        <section
          className="relative w-full h-[220px] sm:h-[260px] bg-center bg-cover flex items-center justify-center"
          style={{
            backgroundImage: "url('/fundoPartidas.jpeg')",
          }}
        ></section>
        <div>
          <h1 className="text-3xl font-bold">Minha Associação</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Informações sobre sua assinatura
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="px-6 py-12 text-center">
            <p className="text-zinc-400">
              Você ainda não possui um plano ativo.
            </p>
            <p className="text-zinc-500 text-sm mt-2">
              Acesse a página de planos para escolher o melhor para você.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <section
        className="relative w-full h-[220px] sm:h-[260px] bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: "url('/fundoPartidas.jpeg')",
        }}
      ></section>
      <div className="space-y-8 p-4">

     
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-3xl font-bold">Minha Associação</h1>
      </div>

      <div className="flex gap-2 flex-col md:flex-row items-center justify-between">
        <div className="flex-shrink-0 md:w-1/3">
          <CarteirinhaSocio
            nome={associacao.nomeSocio}
            matricula={associacao.matricula}
            planoNome={associacao.planoNome ?? ""}
            numeroCartao={associacao.numeroCartao ?? undefined}
          />
        </div>
        <div className=" md:w-2/3">
          <CardResumo associacao={associacao} />
        </div>
      </div>

      <TabelaPagamentosSocio parcelas={parcelas} />
    </div>
     </div>
  );
}
