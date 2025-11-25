"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PerfilCampo } from "./PerfilCampo";

interface PerfilCardProps {
  usuario: {
    nome: string;
    email: string;
    cpf?: string | null;
    id: string;
  };
}

export function PerfilCard({ usuario }: PerfilCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="px-6">
        <CardTitle className="text-white">Dados Pessoais</CardTitle>
        <CardDescription>Informações do seu perfil na plataforma</CardDescription>
      </CardHeader>

      <Separator className="bg-zinc-800" />

      <CardContent className="px-6 pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <PerfilCampo label="Nome Completo" valor={usuario.nome} />
          <PerfilCampo label="E-mail" valor={usuario.email} />
          <PerfilCampo label="CPF" valor={usuario.cpf} />
          <PerfilCampo label="ID do Torcedor" valor={usuario.id} />
        </div>
      </CardContent>
    </Card>
  );
}
