"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { QrCodeIcon, FileTextIcon, CreditCardIcon } from "lucide-react";
import type { PaymentStatus } from "@/app/types/pagamentoItf";
import { ResultadoPagamentoDialog } from "@/components/pagamento/ResultadoPagamentoDialog";
import { PainelPix } from "@/components/pagamento/PainelPix";
import { PainelBoleto } from "@/components/pagamento/PainelBoleto";
import { CardPanel } from "@/components/pagamento/CardPanel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type MetodoPagamento = "PIX" | "BOLETO" | "CARTAO";

export type PagamentoCriado = {
  metodo: MetodoPagamento;
  paymentId?: string;
  statusInicial?: PaymentStatus | string;
};

type TipoAbaPagamento = "pix" | "boleto" | "cartao";

type AbasPagamentoProps = {
  customerId: string;
  orderDescription: string;
  orderTotal: number;
  orderType?: "ingresso" | "plano" | "mensalidade";
  planoId?: string;
  torcedorId?: string;
  jogoId?: string;
  loteId?: string;
};

type IngressoCreateBody = {
  jogoId: string;
  valor: number;
  pagamentoId: string;
  loteId?: string;
  torcedorId?: string;
};

type AssinaturaCreateBody = {
  planoId: string;
  torcedorId: string;
  pagamentoId: string;
  valor: number;
};

export function AbasPagamento({
  customerId,
  orderDescription,
  orderTotal,
  orderType,
  planoId,
  torcedorId,
  jogoId,
  loteId,
}: AbasPagamentoProps) {
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [statusPagamento, setStatusPagamento] =
    useState<PaymentStatus | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<TipoAbaPagamento>("pix");
  const [pagamentoCriado, setPagamentoCriado] =
    useState<PagamentoCriado | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const isIngresso = orderType === "ingresso";
  const isPlano = orderType === "plano";

  function isStatusPago(status: PaymentStatus) {
    return status === "PAID" || status === "APPROVED";
  }

  async function criarIngressoSeNecessario(
    status: PaymentStatus
  ): Promise<string | null> {
    if (!isIngresso) return null;
    if (!isStatusPago(status)) return null;

    if (!pagamentoCriado?.paymentId) {
      toast.error(
        "Pagamento aprovado, mas não recebemos o ID da cobrança para vincular o ingresso."
      );
      return null;
    }

    if (!jogoId) {
      toast.error("Jogo não informado para criação do ingresso.");
      return null;
    }

    try {
      const body: IngressoCreateBody = {
        jogoId: jogoId!,
        valor: orderTotal,
        pagamentoId: pagamentoCriado.paymentId,
      };

      if (loteId) body.loteId = loteId;
      if (torcedorId) body.torcedorId = torcedorId;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingressos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        toast.error( data?.error || data?.message ||"Erro ao criar ingresso após o pagamento.");
        return null;
      }

      const ingressoId: string | undefined =
        data.ingressoId || data.id || data.ingresso?.id;

      if (!ingressoId) {
        toast.error("Pagamento confirmado, mas não recebemos o ID do ingresso.");
        return null;
      }

      return ingressoId;
    } catch (e) {
      console.error(e);
      toast.error("Falha ao criar ingresso após o pagamento.");
      return null;
    }
  }

  async function criarAssinaturaSeNecessario(
    status: PaymentStatus
  ): Promise<void> {
    if (!isPlano) return;
    if (!isStatusPago(status)) return;

    if (!pagamentoCriado?.paymentId) {
      toast.error(
        "Pagamento do plano aprovado, mas não recebemos o ID da cobrança."
      );
      return;
    }

    if (!planoId) {
      toast.error("Plano não informado para criação da assinatura.");
      return;
    }

    if (!torcedorId) {
      toast.error("Torcedor não informado para vincular o plano.");
      return;
    }

    try {
      const body: AssinaturaCreateBody = {
        planoId,
        torcedorId,
        pagamentoId: pagamentoCriado.paymentId,
        valor: orderTotal,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assinaturas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        toast.error(data?.error || data?.message || "Erro ao criar assinatura do plano.");
        return;
      }

      toast.success("Plano vinculado ao torcedor com sucesso!");
    } catch (e) {
      console.error(e);
      toast.error("Falha ao criar assinatura do plano.");
    }
  }

  function finalizarPagamento(status: PaymentStatus, ingressoId?: string) {
    setStatusPagamento(status);

    if (isIngresso) {
      if (ingressoId) {
        window.location.href = `/ingressos/${ingressoId}`;
      } else {
        window.location.href = `/meus-ingressos`;
      }
      return;
    }

    setDialogoAberto(true);
  }

  const aoTentarNovamente = () => {
    setDialogoAberto(false);
    setStatusPagamento(null);
  };

  const aoFechar = () => {
    setDialogoAberto(false);
    setStatusPagamento(null);
  };

  async function handleConfirmarPagamentoFake() {
    if (!pagamentoCriado) {
      toast.error("Nenhum pagamento gerado ainda.");
      return;
    }

    setConfirmLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));

      let status: PaymentStatus;

      switch (pagamentoCriado.metodo) {
        case "PIX":
          status = "PAID";
          break;
        case "BOLETO":
          status = "PENDING";
          break;
        case "CARTAO":
          status = "APPROVED";
          break;
        default:
          status = "ERROR";
      }

      let ingressoId: string | null = null;
      if (isIngresso) {
        ingressoId = await criarIngressoSeNecessario(status);
      }

      if (isPlano) {
        await criarAssinaturaSeNecessario(status);
      }

      finalizarPagamento(status, ingressoId ?? undefined);
    } catch (e) {
      console.error(e);
      toast.error("Falha na simulação de confirmação de pagamento.");
    } finally {
      setConfirmLoading(false);
    }
  }

// async function handleConfirmarPagamento() { 
//   if (!pagamentoCriado?.paymentId) { 
//     toast.error("Nenhum pagamento com ID encontrado.");
//      return; 
//     } 
//     setConfirmLoading(true); 
//       try { 
//         const res = await fetch( ${process.env.NEXT_PUBLIC_API_URL}/asaas/pagamentos/${encodeURIComponent( pagamentoCriado.paymentId )}/status, {
//            method: "GET", headers: { "Content-Type": "application/json" }, 
//           } 
//         ); 
//         if (!res.ok) { 
//           const text = await res.text().catch(() => ""); 
//           throw new Error(HTTP ${res.status} ${text}); 
//         } 
//         const data = await res.json().catch(() => ({} as any)); 
//         const rawStatus = 
//         data?.status || 
//         data?.payment?.status || 
//         data?.data?.status || 
//         data?.result?.status || 
//         data?.statusName || null; 
//         if (!rawStatus) { 
//           toast.error( "Resposta inválida do servidor ao consultar status do pagamento." ); 
//           return; 
//         } 
//         const normalized = String(rawStatus).toUpperCase();
//          let status: PaymentStatus; 
//          if (["PAID", "PAGO", "COMPLETED", "CONFIRMED"].some((s) => normalized.includes(s) )) { 
//           status = "PAID"; 
//         } else if (["APPROVED", "APROVADO"].some((s) => normalized.includes(s) )) {
//           status = "APPROVED";
//         } else if ( ["PENDING", "PENDENTE", "AWAITING_PAYMENT"].some((s) => normalized.includes(s) ) ) {
//            status = "PENDING";
//         } else { 
//           status = "ERROR"; 
//         } 
//         let ingressoId: string | null = null; 
//         if (isIngresso) { 
//           ingressoId = await criarIngressoSeNecessario(status);
//          } 
//          finalizarPagamento(status, ingressoId ?? undefined);
//          } catch (e) { 
//           console.error(e); 
//           toast.error("Falha ao consultar status do pagamento.");
//         } finally { 
//           setConfirmLoading(false); 
//         } 
//       }


  return (
    <>
      <Tabs
        value={abaAtiva}
        onValueChange={(value) => setAbaAtiva(value as TipoAbaPagamento)}
      >
        <TabsList
          className={`grid w-full ${
            isIngresso ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          <TabsTrigger value="pix">
            <QrCodeIcon className="mr-2 size-4" />
            PIX
          </TabsTrigger>

          {!isIngresso && (
            <TabsTrigger value="boleto">
              <FileTextIcon className="mr-2 size-4" />
              Boleto
            </TabsTrigger>
          )}

          <TabsTrigger value="cartao">
            <CreditCardIcon className="mr-2 size-4" />
            Cartão
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pix">
          <Card>
            <CardContent className="pt-6">
              <PainelPix
                customerId={customerId}
                valor={orderTotal}
                descricao={orderDescription}
                onPaymentCreated={(ctx) => setPagamentoCriado(ctx)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {!isIngresso && (
          <TabsContent value="boleto">
            <Card>
              <CardContent className="pt-6">
                <PainelBoleto
                  customerId={customerId}
                  valor={orderTotal}
                  descricao={orderDescription}
                  onPaymentCreated={(ctx) => setPagamentoCriado(ctx)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="cartao">
          <Card>
            <CardContent className="pt-6">
              <CardPanel
                customerId={customerId}
                valor={orderTotal}
                descricao={orderDescription}
                onPaymentCreated={(ctx) => setPagamentoCriado(ctx)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button
          className="w-full"
          disabled={!pagamentoCriado || confirmLoading}
          onClick={handleConfirmarPagamentoFake}
        >
          {confirmLoading
            ? "Verificando pagamento..."
            : "Confirmar pagamento"}
        </Button>
      </div>

      <ResultadoPagamentoDialog
        open={dialogoAberto}
        status={statusPagamento}
        onClose={aoFechar}
        onRetry={aoTentarNovamente}
      />
    </>
  );
}
