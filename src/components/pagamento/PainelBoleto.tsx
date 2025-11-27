"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileTextIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import type { BoletoLinks, PaymentStatus } from "@/app/types/pagamentoItf";
import type { PagamentoCriado } from "@/components/pagamento/AbasPagamento";

interface PainelBoletoProps {
  customerId: string;
  valor: number;
  descricao: string;
  onPaymentCreated: (ctx: PagamentoCriado) => void;
}

type PagamentoApiResponse = {
  id: string;
  status: string;
  bankSlipUrl?: string;
  invoiceUrl?: string;
  dueDate?: string;
};

function mapStatusToUiStatus(status: string): PaymentStatus {
  const s = status.toUpperCase();

  if (
    ["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH", "APPROVED", "PAID"].includes(
      s
    )
  ) {
    return "PAID";
  }

  if (["PENDING", "AWAITING", "IN_PROCESS"].includes(s)) {
    return "PENDING";
  }

  if (["OVERDUE", "EXPIRED"].includes(s)) {
    return "EXPIRED";
  }

  if (["CANCELLED", "REFUNDED", "DECLINED"].includes(s)) {
    return "ERROR";
  }

  return "ERROR";
}

export function PainelBoleto({
  customerId,
  valor,
  descricao,
  onPaymentCreated,
}: PainelBoletoProps) {
  const [loading, setLoading] = useState(false);
  const [boletoLinks, setBoletoLinks] = useState<BoletoLinks | null>(null);

  async function gerarBoleto() {
    try {
      setLoading(true);
      const dueDate = new Date().toISOString().slice(0, 10);

      const body = {
        customerId,
        valor,
        descricao,
        dueDate,
        tipo: "BOLETO" as const,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asaas/pagamentos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = (await res.json().catch(() => null)) as
        | PagamentoApiResponse
        | null;

      if (!res.ok || !data) {
        toast.error("Falha ao gerar boleto");
        return;
      }

      setBoletoLinks({
        bankSlipUrl: String(data.bankSlipUrl ?? ""),
        invoiceUrl: String(data.invoiceUrl ?? ""),
        dueDate: String(data.dueDate ?? ""),
      });

      onPaymentCreated({
        metodo: "BOLETO",
        paymentId: data.id,
        statusInicial: mapStatusToUiStatus(data.status ?? ""),
        valor: valor
      });

      toast.success("Boleto gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar boleto:", error);
      toast.error("Erro ao gerar boleto");
    } finally {
      setLoading(false);
    }
  }

  if (!boletoLinks) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Clique no botão abaixo para gerar o boleto bancário.
          </AlertDescription>
        </Alert>

        <Button onClick={gerarBoleto} disabled={loading} className="w-full">
          {loading ? "Gerando..." : "Gerar Boleto"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <FileTextIcon className="size-4" />
        <AlertDescription>
          <strong>Status:</strong> Aguardando pagamento{" "}
          {boletoLinks.dueDate ? `• Venc.: ${boletoLinks.dueDate}` : ""}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        {boletoLinks.bankSlipUrl && (
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => window.open(boletoLinks.bankSlipUrl!, "_blank")}
          >
            <DownloadIcon className="mr-2 size-4" />
            Baixar Boleto Bancário
          </Button>
        )}

        {boletoLinks.invoiceUrl && (
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => window.open(boletoLinks.invoiceUrl!, "_blank")}
          >
            <DownloadIcon className="mr-2 size-4" />
            Baixar Nota Fiscal
          </Button>
        )}
      </div>

      <Alert>
        <AlertDescription className="text-xs">
          <strong>Importante:</strong> o pagamento do boleto pode levar até 3
          dias úteis para ser confirmado.
        </AlertDescription>
      </Alert>
    </div>
  );
}
