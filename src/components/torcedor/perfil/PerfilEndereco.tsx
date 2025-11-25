"use client";

import { PerfilCampo } from "./PerfilCampo";

interface Props {
  torcedor: Partial<{
    enderecoLogradouro: string | null;
    enderecoNumero: string | null;
    enderecoBairro: string | null;
    enderecoCidade: string | null;
    enderecoUF: string | null;
    enderecoCEP: string | null;
  }>;
}

export function PerfilEndereco({ torcedor }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PerfilCampo label="Logradouro" valor={torcedor.enderecoLogradouro} />
      <PerfilCampo label="Número" valor={torcedor.enderecoNumero} />
      <PerfilCampo label="Bairro" valor={torcedor.enderecoBairro} />
      <PerfilCampo label="Cidade" valor={torcedor.enderecoCidade} />
      <PerfilCampo label="UF" valor={torcedor.enderecoUF} />
      <PerfilCampo label="CEP" valor={torcedor.enderecoCEP} />
    </div>
  );
}
