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
import { useIngresso } from "@/hooks/useIngresso";

function VincularIngressoContent() {
  const router = useRouter();
  const search = useSearchParams();
  const {
    torcedorAtual,
    carregando,
    erro,
    buscarTorcedorByCpf,
    criarIngressoComPagamento,
    resetarErro,
  } = useIngresso();

  // dados vindos da página de pagamento
  const pagamentoId = search.get("pagamentoId");
  const jogoId = search.get("jogoId");
  const loteId = search.get("loteId") ?? undefined;
  const valor = search.get("valor");

  const [cpf, setCpf] = useState("");
  const [ingressoGerado, setIngressoGerado] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleBuscarTorcedor() {
    resetarErro();

    const cpfLimpo = cpf.replace(/\D/g, "");

    if (!cpfLimpo) {
      alert("Informe um CPF válido.");
      return;
    }

    await buscarTorcedorByCpf(cpfLimpo);
  }

  async function handleGerarIngresso() {
    if (ingressoGerado) {
      return;
    }

    if (!torcedorAtual) {
      alert("Selecione um torcedor antes.");
      return;
    }

    if (!loteId) {
      alert("Dados do ingresso inválidos. Volte e tente novamente.");
      return;
    }

    const resultado = await criarIngressoComPagamento({
      loteId,
      pagamentoId: pagamentoId || undefined,
    });

    if (resultado) {
      setSuccessMessage("Ingresso criado com sucesso!");
      setIngressoGerado(true);

      setTimeout(() => {
        const ingressoId = resultado?.ingressoId;
        if (ingressoId) {
          router.push(`/ingressos/${ingressoId}`);
        } else {
          router.push("/meus-ingressos");
        }
      }, 1200);
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
          {erro && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
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
              {valor ? `R$ ${Number(valor).toFixed(2)}` : "Não informado"}
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
              disabled={ingressoGerado}
            />

            <Button
              className="w-full"
              onClick={handleBuscarTorcedor}
              disabled={carregando || ingressoGerado}
            >
              {carregando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Buscando...
                </>
              ) : (
                "Buscar Torcedor"
              )}
            </Button>
          </div>

          {torcedorAtual && (
            <div className="border p-4 rounded-lg space-y-1">
              <p>
                <strong>ID:</strong> {torcedorAtual.id}
              </p>
              <p>
                <strong>Nome:</strong> {torcedorAtual.nome}
              </p>
              <p>
                <strong>Email:</strong> {torcedorAtual.email}
              </p>
              <p>
                <strong>CPF:</strong> {torcedorAtual.cpf}
              </p>

              <Button
                className="w-full mt-3"
                onClick={handleGerarIngresso}
                disabled={carregando || ingressoGerado}
              >
                {ingressoGerado ? "Ingresso já gerado" : "Gerar Ingresso"}
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
          <p className="text-muted-foreground">
            Carregando dados do ingresso...
          </p>
        </div>
      }
    >
      <VincularIngressoContent />
    </Suspense>
  );
}
