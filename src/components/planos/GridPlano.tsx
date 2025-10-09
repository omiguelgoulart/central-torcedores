"use client";

import { useEffect, useState } from "react";
import { CardPlano } from "./CardPlano";
import { IPlano } from "@/app/types/planoItf";

export function GridPlano() {
  const [planos, setPlanos] = useState<IPlano[]>([]);

  useEffect(() => {
    async function fetchPlanos() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/planos`);
      if (!response.ok) {
        console.error("Falha ao buscar planos:", response.statusText);
        return;
      }
      const data: IPlano[] = await response.json();
      setPlanos(data);
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
      fetchPlanos();
    }
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {planos.map((plan) => (
        // Pass only the props that CardPlano expects — avoid spreading the whole plan object into props
        <CardPlano plano={plan} variant={"torcedor"} key={plan.id} />
      ))}
    </div>
  );
}
