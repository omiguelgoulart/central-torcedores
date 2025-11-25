"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { PedidoJogo, StatusPedido } from "@/components/admin/ingresso/types"
import { formatBRL } from "@/lib/formatters"

type PedidoDetalheDialogProps = {
  pedido: PedidoJogo
}

function getStatusVariant(status: StatusPedido) {
  if (status === "PAGO") return "default" as const
  if (status === "PENDENTE_PAGAMENTO") return "destructive" as const
  if (status === "RESERVA_ATIVA") return "secondary" as const
  return "outline" as const
}

export function PedidoDetalheDialog({ pedido }: PedidoDetalheDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Pedido #{pedido.id}</DialogTitle>
          <DialogDescription>
            Detalhes rápidos do pedido e do ingresso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Torcedor</span>
            <span className="font-medium">{pedido.torcedor}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Setor</span>
            <span>{pedido.setor}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={getStatusVariant(pedido.status)}>
              {pedido.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Quantidade</span>
            <span className="font-semibold">{pedido.quantidade}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold text-primary">
              {formatBRL(pedido.total)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Expira em</span>
            <span className="text-xs">
              {pedido.expiraEm ?? "Sem data de expiração"}
            </span>
          </div>

          {/* Aqui você pode adicionar mais coisas:
             - Lista de ingressos do pedido
             - Tipo de pagamento
             - Código / QR Code (imagem)
          */}

          <div className="pt-2 flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
