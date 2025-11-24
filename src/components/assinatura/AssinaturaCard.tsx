"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import type { Periodicidade } from "@/app/types/planoItf";

interface AssinaturaCardProps {
  planoId: string;
  planoNome: string;
  planoDescricao: string;
  valor: number;
  defaultRecorrencia: Periodicidade;
}

const recorrenciaLabel: Record<Periodicidade, string> = {
  MENSAL: "Mensal",
  TRIMESTRAL: "Trimestral",
  SEMESTRAL: "Semestral",
  ANUAL: "Anual",
};

export function AssinaturaCard({
  planoId,
  planoNome,
  planoDescricao,
  valor,
  defaultRecorrencia,
}: AssinaturaCardProps) {
  const router = useRouter();
  const [recorrencia, setRecorrencia] =
    useState<Periodicidade>(defaultRecorrencia);

  const precoBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

  function handleSubmit() {
    const params = new URLSearchParams({
      tipo: "plano",
      planoId,
      recorrencia,
      description: `Plano ${planoNome} (${recorrenciaLabel[recorrencia]})`,
      subtotal: String(valor),
      fees: "0",
      total: String(valor),
    });

    router.push(`/pagamento?${params.toString()}`);
  }

  return (
    <Card className="p-6 space-y-6 bg-[#181818] border-[#2a2a2a]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{planoNome}</CardTitle>

        {planoDescricao && (
          <CardDescription className="mt-2">{planoDescricao}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Valor do plano</p>
          <p className="text-3xl font-semibold">{precoBRL}</p>
        </div>

        <div className="space-y-2">
          <Label>Recorrência do pagamento</Label>
          <Select
            value={recorrencia}
            onValueChange={(v: Periodicidade) => setRecorrencia(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a recorrência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MENSAL">Mensal</SelectItem>
              <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
              <SelectItem value="SEMESTRAL">Semestral</SelectItem>
              <SelectItem value="ANUAL">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" size="lg" onClick={handleSubmit}>
          Ir para pagamento
        </Button>
      </CardContent>
    </Card>
  );
}
