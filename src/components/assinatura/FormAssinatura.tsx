"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Periodicidade } from "@/app/types/planoItf";

interface FormAssinaturaProps {
  planoId: string;
  planoNome: string;
  valor: number;
  defaultRecorrencia: Periodicidade;
}

const recorrenciaLabel: Record<Periodicidade, string> = {
  MENSAL: "Mensal",
  TRIMESTRAL: "Trimestral",
  SEMESTRAL: "Semestral",
  ANUAL: "Anual",
};

export function FormAssinatura({
  planoId,
  planoNome,
  valor,
  defaultRecorrencia,
}: FormAssinaturaProps) {
  const router = useRouter();

  const [recorrencia, setRecorrencia] =
    useState<Periodicidade>(defaultRecorrencia);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const precoBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(valor);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (!recorrencia) {
      setErrorMsg("Escolha uma recorrência para continuar.");
      return;
    }

    setIsSubmitting(true);

    const description = `Plano Sócio - ${planoNome} (${recorrenciaLabel[recorrencia]})`;

    const params = new URLSearchParams({
      tipo: "plano",
      planoId,
      recorrencia,
      description,
      subtotal: String(valor),
      fees: "0",
      total: String(valor),
    });

    router.push(`/pagamento?${params.toString()}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolha a recorrência</CardTitle>
        <CardDescription>
          Defina como deseja ser cobrado pelo plano <strong>{planoNome}</strong>.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor */}
          <div>
            <p className="text-sm text-muted-foreground">Valor por ciclo:</p>
            <p className="text-2xl font-semibold">{precoBRL}</p>
          </div>

          {/* Seletor de recorrência */}
          <div className="space-y-2">
            <Label>Recorrência do pagamento</Label>

            <Select
              value={recorrencia}
              onValueChange={(value: Periodicidade) => setRecorrencia(value)}
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

          {/* Botão */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Redirecionando..." : "Ir para pagamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
