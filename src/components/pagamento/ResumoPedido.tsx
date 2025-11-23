"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import type { ResumoPedido as ResumoPedidoTipo } from "@/app/types/pagamentoItf";

interface ResumoPedidoProps {
  pedido: ResumoPedidoTipo;
}

export function ResumoPedido({ pedido }: ResumoPedidoProps) {
  if (!pedido) return null;

  return (
    <Card className="border-muted">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Resumo do Pedido</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{pedido.description}</span>
            <span className="font-medium">
              {formatCurrency(pedido.subtotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxas</span>
            <span className="font-medium">
              {formatCurrency(pedido.fees)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(pedido.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
