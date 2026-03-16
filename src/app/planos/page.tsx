"use client";

import { useEffect } from "react";
import type { IPlano } from "@/app/types/planoItf";
import { HeaderPlano } from "@/components/planos/HeaderPlano";
import { CardPlano } from "@/components/planos/CardPlano";
import { PlanosLoadingSkeleton } from "@/components/planos/PlanosLoadingSkeleton";
import usePlano from "@/hooks/usePlano";

export default function PlanosPage() {
  const { planos, loading, fetchPlanos } = usePlano();
  const planosList: IPlano[] = planos ?? [];

  useEffect(() => {
    fetchPlanos();
  }, [fetchPlanos]);

  if (loading) {
    return <PlanosLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <HeaderPlano />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-12">
          {planosList.map((plano: IPlano) => (
            <CardPlano key={plano.id} plano={plano} />
          ))}
        </div>
      </div>
    </div>
  );
}
