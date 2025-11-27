"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type TorcedorResumo = {
  id: string;
  nome: string;
  email: string;
  cpf?: string | null;
};

function VincularIngressoContent() {
  const router = useRouter();
  const search = useSearchParams();
  const { token } = useAuth();

  // dados vindos da página de pagamento
  const pagamentoId = search.get("pagamentoId");
  const jogoId = search.get("jogoId");
  const loteId = search.get("loteId") ?? undefined;
  const valor = search.get("valor");

  const [cpf, setCpf] = useState("");
  const [torcedor, setTorcedor] = useState<TorcedorResumo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function buscarTorcedor() {
    setErrorMessage(null);
    setTorcedor(null);

    const cpfLimpo = cpf.replace(/\D/g, "");

    if (!cpfLimpo) {
      setErrorMessage("Informe um CPF válido.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API}/usuario/cpf/${cpfLimpo}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Torcedor não encontrado.");
        return;
      }

      setTorcedor(data);
    } catch {
      setErrorMessage("Erro ao buscar torcedor.");
    } finally {
      setIsLoading(false);
    }
  }

  async function gerarIngresso() {
    if (!torcedor) {
      setErrorMessage("Selecione um torcedor antes.");
      return;
    }

    if (!jogoId || !valor) {
      setErrorMessage("Dados do ingresso inválidos. Volte e tente novamente.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const payload = {
      jogoId,
      loteId,
      valor,
      torcedorId: torcedor.id,
    };

    try {
      console.log("Payload para criar ingresso:", payload);

      const response = await fetch(`${API}/admin/ingresso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error ?? data?.message ?? "Erro ao gerar ingresso.");
        return;
      }

      const ingressoId = data?.ingressoId ?? data?.ingresso?.id;

      setSuccessMessage("Ingresso criado com sucesso!");

      setTimeout(() => {
        if (ingressoId) {
          router.push(`/ingressos/${ingressoId}`);
        } else {
          router.push("/meus-ingressos");
        }
      }, 1200);
    } catch {
      setErrorMessage("Erro ao criar ingresso.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Vincular Ingresso</CardTitle>
          <CardDescription>
            Informe o CPF para vincular este ingresso ao torcedor correto.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="border-green-500/60">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="border p-4 rounded-lg space-y-1 text-sm">
            <p>
              <strong>Jogo:</strong> {jogoId}
            </p>
            <p>
              <strong>Lote:</strong> {loteId ?? "Não informado"}
            </p>
            <p>
              <strong>Valor:</strong>{" "}
              {valor
                ? `R$ ${Number(valor).toFixed(2)}`
                : "Não informado"}
            </p>
            <p>
              <strong>Pagamento ID:</strong> {pagamentoId ?? "Não informado"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>CPF do Torcedor</Label>
            <Input
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />

            <Button
              className="w-full"
              onClick={buscarTorcedor}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Buscando...
                </>
              ) : (
                "Buscar Torcedor"
              )}
            </Button>
          </div>

          {torcedor && (
            <div className="border p-4 rounded-lg space-y-1">
              <p>
                <strong>ID:</strong> {torcedor.id}
              </p>
              <p>
                <strong>Nome:</strong> {torcedor.nome}
              </p>
              <p>
                <strong>Email:</strong> {torcedor.email}
              </p>
              <p>
                <strong>CPF:</strong> {torcedor.cpf}</p>

              <Button className="w-full mt-3" onClick={gerarIngresso}>
                Gerar Ingresso
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VincularIngressoPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto py-10 px-4 text-center">
          <p className="text-muted-foreground">Carregando dados do ingresso...</p>
        </div>
      }
    >
      <VincularIngressoContent />
    </Suspense>
  );
}
