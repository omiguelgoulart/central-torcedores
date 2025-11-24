"use client";

interface Props {
  valor: number | null;
  periodicidade: string | null;
  dataInicio?: string | null;
  proximaCobranca?: string | null;
}

export function AssociacaoStatus({
  valor,
  periodicidade,
  dataInicio,
  proximaCobranca,
}: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR");

  const periodMap: Record<string, string> = {
    MENSAL: "Mensal",
    TRIMESTRAL: "Trimestral",
    SEMESTRAL: "Semestral",
    ANUAL: "Anual",
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">Valor</p>
        <p className="text-white font-semibold">R$ {valor?.toFixed(2)}</p>
      </div>

      <div>
        <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">Periodicidade</p>
        <p className="text-white font-semibold">{periodMap[periodicidade ?? ""]}</p>
      </div>

      {dataInicio && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">Data de Início</p>
          <p className="text-white font-semibold">{formatDate(dataInicio)}</p>
        </div>
      )}

      {proximaCobranca && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">Próxima Cobrança</p>
          <p className="text-white font-semibold">{formatDate(proximaCobranca)}</p>
        </div>
      )}
    </div>
  );
}
