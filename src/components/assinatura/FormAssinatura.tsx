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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useAssinatura } from "@/hooks/useAssinatura";

interface FormAssinaturaProps {
  planoId: string;
  planoNome: string;
  valor: number;
}

export function FormAssinatura({ planoId, planoNome, valor }: FormAssinaturaProps) {
  const router = useRouter();
  const { torcedor } = useAuth();
  const { criarAssinatura } = useAssinatura();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const precoBRL = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
      }).format(valor),
    [valor],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (!planoId) {
      setErrorMsg("ID do plano não encontrado. Tente novamente.");
      return;
    }

    if (!torcedor?.id) {
      setErrorMsg("Não foi possível identificar seu usuário.");
      return;
    }

    setIsSubmitting(true);

    try {
      await criarAssinatura({ planoId });
      router.push("/torcedor/minhaAssociacao");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Falha ao criar assinatura. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmar assinatura</CardTitle>
        <CardDescription>
          Plano anual <strong>{planoNome}</strong> — pague mensalmente via
          boleto com vencimento todo dia&nbsp;15.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Valor mensal:</p>
            <p className="text-2xl font-semibold">{precoBRL}</p>
            <p className="text-xs text-muted-foreground mt-1">
              vencimento dia&nbsp;15 de cada mês
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Criando assinatura..." : "Confirmar assinatura"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
