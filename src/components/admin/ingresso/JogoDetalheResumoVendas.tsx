"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatBRL } from "@/lib/formatters"
import { PedidoJogo } from "./types"

type JogoDetalheResumoVendasProps = {
  pedidos: PedidoJogo[]
}

export function JogoDetalheResumoVendas({
  pedidos,
}: JogoDetalheResumoVendasProps) {
  const totalPedidos = pedidos.length
  const reservasAtivas = pedidos.filter(
    (p) => p.status === "RESERVA_ATIVA",
  ).length
  const pendentesPagamento = pedidos.filter(
    (p) => p.status === "PENDENTE_PAGAMENTO",
  ).length
  const valorTotal = pedidos.reduce((acc, p) => acc + p.total, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Total de Pedidos
          </p>
          <p className="text-2xl font-bold">{totalPedidos}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Reservas Ativas
          </p>
          <p className="text-2xl font-bold text-blue-500">
            {reservasAtivas}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Pendente Pagamento
          </p>
          <p className="text-2xl font-bold text-amber-500">
            {pendentesPagamento}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-1">
            Valor Total
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatBRL(valorTotal)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
