"use client";

import { useMemo, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";

interface FormAssinaturaProps {
  planoId: string;
  planoNome: string;
  valor: number; // valor base (ex.: mensal)
  defaultRecorrencia: Periodicidade;
}

const recorrenciaLabel: Record<Periodicidade, string> = {
  MENSAL: "Mensal",
  TRIMESTRAL: "Trimestral",
  SEMESTRAL: "Semestral",
  ANUAL: "Anual",
};

const multiplicadorRecorrencia: Record<Periodicidade, number> = {
  MENSAL: 1,
  TRIMESTRAL: 3,
  SEMESTRAL: 6,
  ANUAL: 12,
};

export function FormAssinatura({
  planoId,
  planoNome,
  valor,
  defaultRecorrencia,
}: FormAssinaturaProps) {
  const router = useRouter();
  const { usuario } = useAuth();

  const [recorrencia, setRecorrencia] =
    useState<Periodicidade>(defaultRecorrencia);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // valor por ciclo conforme recorrência
  const valorCiclo = useMemo(() => {
    const fator = multiplicadorRecorrencia[recorrencia] ?? 1;
    return valor * fator;
  }, [valor, recorrencia]);

  const precoBRL = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
      }).format(valorCiclo),
    [valorCiclo]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (!planoId) {
      setErrorMsg("ID do plano não encontrado. Tente novamente.");
      return;
    }

    if (!recorrencia) {
      setErrorMsg("Escolha uma recorrência para continuar.");
      return;
    }

    if (!usuario?.id) {
      setErrorMsg("Não foi possível identificar seu usuário.");
      return;
    }

    setIsSubmitting(true);

    const description = `Plano Sócio - ${planoNome} (${recorrenciaLabel[recorrencia]})`;

    const params = new URLSearchParams({
      tipo: "plano",
      planoId,
      clienteId: usuario.id,
      recorrencia,
      description, // URLSearchParams já faz o encode
      subtotal: String(valorCiclo),
      fees: "0",
      total: String(valorCiclo),
    });

    router.push(`/pagamento?${params.toString()}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolha a recorrência</CardTitle>
        <CardDescription>
          Defina como deseja ser cobrado pelo plano{" "}
          <strong>{planoNome}</strong>.
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
            <p className="text-sm text-muted-foreground">
              Valor por ciclo ({recorrenciaLabel[recorrencia]}):
            </p>
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
