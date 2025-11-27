"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { AbasPagamento } from "@/components/pagamento/AbasPagamento";
import { ResumoPedido } from "@/components/pagamento/ResumoPedido";
import type { ResumoPedido as ResumoPedidoTipo } from "@/app/types/pagamentoItf";
import { useAuth } from "../../hooks/useAuth";
import { CadastroCustomerIdForm } from "@/components/pagamento/CadastroCustomerIdForm";

type TipoPedido = "ingresso" | "plano" | "mensalidade";

function PagamentoPageContent() {
  const router = useRouter();
  const search = useSearchParams();
  const { usuario, fetchMe, loading } = useAuth();

  const [customerId, setCustomerId] = useState<string | null>(null);

  const tipoPedido: TipoPedido =
    (search.get("tipo") as TipoPedido) || "ingresso";

  const planoId = search.get("planoId") ?? undefined;
  const recorrencia = search.get("recorrencia") ?? undefined;

  // 🔴 pegar jogoId e loteId da URL
  const jogoId = search.get("jogoId") ?? undefined;
  const loteId = search.get("loteId") ?? undefined;

  const pedido: ResumoPedidoTipo = useMemo(() => {
    const descFromUrl = search.get("description");
    const subtotalFromUrl = search.get("subtotal");
    const feesFromUrl = search.get("fees");
    const totalFromUrl = search.get("total");

    let defaultDescription = "Pagamento";

    if (tipoPedido === "ingresso") {
      defaultDescription = "Ingresso - Arquibancada";
    } else if (tipoPedido === "plano") {
      defaultDescription = "Plano de Sócio";
    } else if (tipoPedido === "mensalidade") {
      defaultDescription = "Mensalidade Sócio";
    }

    const description = descFromUrl ?? defaultDescription;
    const subtotal = subtotalFromUrl ? Number(subtotalFromUrl) : 69.9;
    const fees = feesFromUrl ? Number(feesFromUrl) : 0;
    const total = totalFromUrl ? Number(totalFromUrl) : subtotal + fees;

    return { description, subtotal, fees, total };
  }, [search, tipoPedido]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!loading && !usuario) {
      toast.warning("Você precisa estar logado para continuar o pagamento.");
      const timer = setTimeout(() => router.push("/login"), 2000);
      return () => clearTimeout(timer);
    }
    return;
  }, [loading, usuario, router]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl py-16 px-4 text-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container mx-auto max-w-5xl py-16 px-4 text-center">
        <p className="text-muted-foreground">
          Você precisa estar logado para finalizar o pagamento. <br />
          Redirecionando para a tela de login...
        </p>
      </div>
    );
  }

  if (!customerId) {
    return (
      <CadastroCustomerIdForm
        defaultName={usuario.nome}
        defaultEmail={usuario.email}
        onCustomerCreated={(id) => {
          setCustomerId(id);
        }}
      />
    );
  }

  const tituloPagina =
    tipoPedido === "ingresso"
      ? "Pagamento de Ingresso"
      : tipoPedido === "plano"
      ? "Pagamento de Plano Sócio"
      : "Pagamento de Mensalidade";

  return (
    <div className="p-4">
      <div className="mb-8 flex items-center flex-col text-center">
        <h1 className="text-3xl font-bold mb-2">{tituloPagina}</h1>
        <p className="text-muted-foreground">
          Escolha a forma de pagamento e finalize sua compra
        </p>
        {tipoPedido !== "ingresso" && recorrencia && (
          <p className="text-xs text-muted-foreground mt-1">
            {tipoPedido === "plano"
              ? `Plano com cobrança ${recorrencia}.`
              : `Mensalidade com cobrança ${recorrencia}.`}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div>
          <AbasPagamento
            customerId={customerId}
            orderDescription={pedido.description}
            orderTotal={pedido.total}
            orderType={tipoPedido}
            planoId={planoId}
            torcedorId={usuario.id}
            jogoId={jogoId}
            loteId={loteId}
          />
        </div>

        <div>
          <ResumoPedido pedido={pedido} />
        </div>
      </div>
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-5xl py-16 px-4 text-center">
          <p className="text-muted-foreground">
            Carregando informações de pagamento...
          </p>
        </div>
      }
    >
      <PagamentoPageContent />
    </Suspense>
  );
}
