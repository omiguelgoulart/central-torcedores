"use client";

import { PerfilCampo } from "./PerfilCampo";

interface Props {
  assinaturas: {
    id: string;
    status: string;
    inicioEm: string;
    proximaCobrancaEm?: string | null;
    plano: {
      nome: string;
      descricao?: string | null;
      valor: string;
      periodicidade: string;
    };
  }[];
}

export function PerfilAssinaturas({ assinaturas }: Props) {
  if (assinaturas.length === 0) {
    return <p className="text-zinc-400 text-sm">Nenhum plano ativ.</p>;
  }

  return (
    <div className="space-y-6">
      {assinaturas.map((a) => (
        <div key={a.id} className="rounded-xl border border-zinc-800 p-4">
          <p className="font-semibold text-white">{a.plano.nome}</p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <PerfilCampo label="Status" valor={a.status} />
            <PerfilCampo label="Início" valor={new Date(a.inicioEm).toLocaleDateString()} />
            <PerfilCampo label="Próxima cobrança" valor={a.proximaCobrancaEm ? new Date(a.proximaCobrancaEm).toLocaleDateString() : "-"} />
            <PerfilCampo label="Valor" valor={`R$ ${a.plano.valor}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
