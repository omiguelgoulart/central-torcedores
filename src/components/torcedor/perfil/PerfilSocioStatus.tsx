"use client";

import { PerfilCampo } from "./PerfilCampo";

interface Props {
  status?: string | null;
  matricula: string;
}

export function PerfilSocioStatus({ status, matricula }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PerfilCampo label="Status de Sócio" valor={status ?? "Não definido"} />
      <PerfilCampo label="Matrícula" valor={matricula} />
    </div>
  );
}
