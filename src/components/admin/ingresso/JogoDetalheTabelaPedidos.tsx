"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatBRL } from "@/lib/formatters"
import { PedidoJogo, StatusPedido } from "./types"
import { PedidoDetalheDialog } from "./PedidoDetalheDialog" // ← ADICIONAR AQUI

type JogoDetalheTabelaPedidosProps = {
  pedidos: PedidoJogo[]
}

function getStatusVariant(status: StatusPedido) {
  if (status === "PAGO") return "default" as const
  if (status === "PENDENTE_PAGAMENTO") return "destructive" as const
  if (status === "RESERVA_ATIVA") return "secondary" as const
  return "outline" as const
}

export function JogoDetalheTabelaPedidos({
  pedidos,
}: JogoDetalheTabelaPedidosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Pedidos deste jogo ({pedidos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-muted-foreground text-xs">
                <th className="text-left py-3 font-medium">Torcedor</th>
                <th className="text-left py-3 font-medium">Setor</th>
                <th className="text-left py-3 font-medium">Status</th>
                <th className="text-left py-3 font-medium">Qtd</th>
                <th className="text-left py-3 font-medium">Total</th>
                <th className="text-left py-3 font-medium">Expira</th>
                <th className="text-left py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-muted/50">
                  <td className="py-3 font-medium">{pedido.torcedor}</td>
                  <td className="py-3">{pedido.setor}</td>
                  <td className="py-3">
                    <Badge variant={getStatusVariant(pedido.status)}>
                      {pedido.status}
                    </Badge>
                  </td>
                  <td className="py-3 font-semibold">
                    {pedido.quantidade}
                  </td>
                  <td className="py-3 font-semibold text-primary">
                    {formatBRL(pedido.total)}
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">
                    {pedido.expiraEm ?? "-"}
                  </td>
                  <td className="py-3">
                    <PedidoDetalheDialog pedido={pedido} />
                  </td>
                </tr>
              ))}

              {pedidos.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    Nenhum pedido encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
