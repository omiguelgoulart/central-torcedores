"use client";

import { useEffect, useState } from "react";
import type { IPlano } from "@/app/types/planoItf";
import { HeaderPlano } from "@/components/planos/HeaderPlano";
import { CardPlano } from "@/components/planos/CardPlano";

export default function PlanosPage() {
  const [planos, setPlanos] = useState<IPlano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlanos() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/planos`);
        if (!response.ok) throw new Error("Erro ao buscar planos");

        const data = (await response.json()) as IPlano[];
        setPlanos(data);
      } catch (err) {
        console.error("Erro ao carregar planos:", err);
      } finally {
        setLoading(false);
      }
    }

    void fetchPlanos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <HeaderPlano />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-12">
          {planos.map((plano) => (
            <CardPlano key={plano.id} plano={plano} />
          ))}
        </div>
      </div>
    </div>
  );
}
