"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CopyIcon, ClockIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { PagamentoCriado } from "@/components/pagamento/AbasPagamento";
import { mapStatusToUiStatus } from "@/lib/payment-utils";
import { useAsaas } from "@/hooks/useAsaas";

type PixQrLocal = {
  encodedImage?: string;
  payload?: string;
  expiresponseAt?: string | null;
};

interface PainelPixProps {
  customerId: string;
  valor: number | string;
  descricao: string;
  onPaymentCreated: (ctx: PagamentoCriado) => void;
}

export function PainelPix({
  customerId,
  valor,
  descricao,
  onPaymentCreated,
}: PainelPixProps) {
  const { criarPagamento, obterQrCodePix } = useAsaas();
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [pixQr, setPixQr] = useState<PixQrLocal | null>(null);

  const hasQr = !!paymentId && !!pixQr;

  function normalizarValor(v: number | string): number {
    if (typeof v === "number") return v;
    const num = Number(String(v).replace(",", "."));
    if (Number.isNaN(num)) {
      throw new Error("Valor do pagamento inválido.");
    }
    return num;
  }

  async function handleGerarPix() {
    try {
      setLoading(true);

      if (!customerId) {
        throw new Error("O Customer ID não foi fornecido para o pagamento.");
      }

      const dueDate = new Date().toISOString().slice(0, 10);
      const valorNumber = normalizarValor(valor);

      const body = {
        tipo: "PIX" as const,
        customerId,
        valor: valorNumber,
        descricao: descricao?.trim(),
        dueDate,
      };

      const pagamento = await criarPagamento(body);

      const pagamentoId = (pagamento as { id?: string }).id;
      if (!pagamentoId) {
        throw new Error("Resposta de pagamento invalida: id nao retornado.");
      }

      setPaymentId(pagamentoId);

      onPaymentCreated({
        metodo: "PIX",
        paymentId: pagamentoId,
        statusInicial: mapStatusToUiStatus(
          String((pagamento as { status?: string }).status ?? ""),
        ),
        valor: 0,
      });

      const qrData = await obterQrCodePix(pagamentoId);

      setPixQr({
        encodedImage: qrData.encodedImage,
        payload: qrData.payload,
        expiresponseAt: qrData.expirationDate,
      });

      toast.success("QR Code gerado", {
        description: "Escaneie o código ou copie o payload PIX.",
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Falha ao gerar QR Code PIX:", error);
      toast.error("Falha ao gerar QR Code PIX", { description: errMsg });
    } finally {
      setLoading(false);
    }
  }

  if (!hasQr) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Clique no botão abaixo para gerar o QR Code PIX e realizar o
            pagamento.
          </AlertDescription>
        </Alert>
        <Button onClick={handleGerarPix} disabled={loading} className="w-full">
          {loading ? "Gerando..." : "Gerar QR Code PIX"}
        </Button>
      </div>
    );
  }

  const qrSrc =
    pixQr?.encodedImage && pixQr.encodedImage.length
      ? pixQr.encodedImage.startsWith("data:")
        ? pixQr.encodedImage
        : `data:image/png;base64,${pixQr.encodedImage}`
      : "/placeholder.svg";

  const expirationDate = pixQr?.expiresponseAt
    ? new Date(pixQr.expiresponseAt)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border bg-white p-4">
          <Image
            src={qrSrc}
            alt="QR Code PIX"
            width={192}
            height={192}
            className="h-48 w-48 object-contain"
          />
        </div>

        <div className="w-full space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            Ou copie o código PIX:
          </p>
          <div className="flex gap-2">
            <div className="flex-1 break-all rounded-md border bg-muted px-3 py-2 text-xs font-mono">
              {pixQr?.payload ? `${pixQr.payload.substring(0, 60)}...` : ""}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                pixQr?.payload && navigator.clipboard.writeText(pixQr.payload)
              }
            >
              <CopyIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <Alert>
        <ClockIcon className="size-4" />
        <AlertDescription>
          {expirationDate
            ? `Este QR Code expira no dia ${expirationDate.toLocaleDateString(
                "pt-BR",
              )} às ${expirationDate.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Este QR Code possui validade limitada."}
        </AlertDescription>
      </Alert>
    </div>
  );
}
