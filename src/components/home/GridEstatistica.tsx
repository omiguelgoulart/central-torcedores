"use client";

import { CardEstatistica } from "./CardEstatistica";


export function GridEstatistica() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardEstatistica valor={3} rotulo="Ingressos Ativos" />
      <CardEstatistica valor="Sócio" rotulo="Status Atual" />
      <CardEstatistica valor="R$ 150" rotulo="Economia Total" />
    </div>
  );
}
