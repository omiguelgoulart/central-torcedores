"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { IPlano, Periodicidade } from "@/app/types/planoItf";
import { ResumoPlano } from "@/components/assinatura/ResumoPlano";
import { FormAssinatura } from "@/components/assinatura/FormAssinatura";

export default function AssinaturaPage() {
  const search = useSearchParams();
  const planoId = search.get("planoId");
  const defaultRecorrenciaParam = search.get(
    "defaultRecorrencia"
  ) as Periodicidade | null;

  const [plano, setPlano] = useState<IPlano | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!planoId) return;

    async function fetchPlano() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/planos/${planoId}`);
        if (!res.ok) {
          throw new Error("Erro ao buscar plano");
        }
        const data = (await res.json()) as IPlano;
        setPlano(data);
      } catch (error) {
        console.error(error);
        setErrorMsg("Não foi possível carregar os dados do plano.");
      } finally {
        setLoading(false);
      }
    }

    void fetchPlano();
  }, [planoId]);

  if (!planoId) {
    return (
      <div className="container mx-auto max-w-lg py-16 px-4 text-center">
        <p className="text-muted-foreground">
          Não foi possível carregar os dados do plano. Volte e selecione um
          plano novamente.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-lg py-16 px-4 text-center">
        <p className="text-muted-foreground">Carregando plano...</p>
      </div>
    );
  }

  if (!plano || errorMsg) {
    return (
      <div className="container mx-auto max-w-lg py-16 px-4 text-center">
        <p className="text-muted-foreground">
          {errorMsg ?? "Não foi possível carregar os dados do plano."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ResumoPlano plano={plano} />

      <FormAssinatura
        planoId={plano.id}
        planoNome={plano.nome}
        valor={plano.valor}
        defaultRecorrencia={defaultRecorrenciaParam ?? plano.periodicidade}
      />
    </div>
  );
}
