"use client";

import { useState, useMemo } from "react";
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

export default function VincularIngressoPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { token } = useAuth();

  // dados vindos da página de pagamento (query string)
  const pagamentoId = search.get("pagamentoId");
  const jogoId = search.get("jogoId"); // deve ser o UUID do jogo
  const loteId = search.get("loteId") ?? undefined;
  const valorParam = search.get("valor"); // string ou null

  const valorFormatado = useMemo(() => {
    if (!valorParam) return "--";
    const n = Number(valorParam);
    if (Number.isNaN(n)) return valorParam;
    return n.toFixed(2);
  }, [valorParam]);

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
    // valida se os dados essenciais vieram da URL
    if (!jogoId) {
      setErrorMessage("Dados do jogo não informados. Volte ao pagamento e tente novamente.");
      return;
    }

    if (!valorParam) {
      setErrorMessage("Valor do ingresso não informado.");
      return;
    }

    if (!pagamentoId) {
      setErrorMessage("ID do pagamento não informado.");
      return;
    }

    if (!torcedor) {
      setErrorMessage("Selecione um torcedor antes.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      jogoId,                 // 👈 nome que o backend espera
      loteId,                 // opcional, backend trata como optional
      valor: valorParam,      // string, o zod transforma pra decimal
      torcedorId: torcedor.id,
      pagamentoId,
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

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msg =
          data?.error ??
          data?.message ??
          "Erro ao gerar ingresso.";
        setErrorMessage(msg);
        return;
      }

      const ingressoId =
        data?.ingressoId ?? data?.ingresso?.id ?? null;

      setSuccessMessage("Ingresso criado com sucesso!");

      // se não tiver id, só volta pra listagem (evita quebrar)
      setTimeout(() => {
        if (ingressoId) {
          router.push(`/ingressos/${ingressoId}`);
        } else {
          router.push("/ingressos");
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

          {/* RESUMO DO PEDIDO */}
          <div className="border p-4 rounded-lg space-y-1 text-sm">
            <p>
              <strong>Jogo:</strong> {jogoId ?? "Não informado"}
            </p>
            <p>
              <strong>Lote:</strong> {loteId ?? "Não informado"}
            </p>
            <p>
              <strong>Valor:</strong> R$ {valorFormatado}
            </p>
            <p>
              <strong>Pagamento ID:</strong> {pagamentoId ?? "Não informado"}
            </p>
          </div>

          {/* BUSCAR TORCEDOR */}
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

          {/* TORCEDOR ENCONTRADO */}
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

              <Button
                className="w-full mt-3"
                onClick={gerarIngresso}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Gerando ingresso...
                  </>
                ) : (
                  "Gerar Ingresso"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
