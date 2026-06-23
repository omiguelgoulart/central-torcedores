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

        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {planosList.map((plano: IPlano) => (
            <div key={plano.id} className="w-full sm:flex-1 sm:min-w-64 sm:max-w-96">
              <CardPlano plano={plano} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
