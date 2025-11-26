"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { formatBRL } from "@/lib/formatters"
import {
  MetodoPagamentoApi,
  PaymentRow,
  PaymentStatus,
} from "./types"

function humanizeMetodo(metodo: MetodoPagamentoApi): string {
  switch (metodo) {
    case "PIX":
      return "Pix"
    case "BOLETO":
      return "Boleto"
    case "CARTAO":
      return "Cartão"
    default:
      return metodo
  }
}

function getStatusVariant(status: PaymentStatus) {
  if (status === "PAGO") return "default" as const
  if (status === "ATRASADO") return "destructive" as const
  if (status === "PENDENTE" || status === "AGENDADO") return "secondary" as const
  return "outline" as const
}

function getTipoLabel(p: PaymentRow): string {
  if (p.tipo === "INGRESSO") return "Ingresso"
  if (p.tipo === "PLANO") return "Plano / Assinatura"
  return "Outro"
}

export function PagamentoDetalheDialog({ pagamento }: { pagamento: PaymentRow }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do pagamento</DialogTitle>
          <DialogDescription>
            Veja as informações completas desta transação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Torcedor</p>
              <p className="font-medium">{pagamento.torcedorNome}</p>
            </div>
            <Badge variant={getStatusVariant(pagamento.status)}>
              {pagamento.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Valor</p>
              <p className="font-semibold text-primary">
                {formatBRL(Number(pagamento.valor))}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Método</p>
              <p>{humanizeMetodo(pagamento.metodo)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Data</p>
              <p>{pagamento.data}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Referência</p>
              <p>{pagamento.referencia ?? "—"}</p>
            </div>
          </div>

          <div className="border-t pt-3 space-y-1">
            <p className="text-xs text-muted-foreground">Tipo de cobrança</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getTipoLabel(pagamento)}</Badge>
              {pagamento.origemLabel && (
                <span className="text-xs text-muted-foreground">
                  {pagamento.origemLabel}
                </span>
              )}
            </div>
            {pagamento.tipo === "INGRESSO" && (
              <p className="text-xs text-muted-foreground">
                Pagamento relacionado a compra de ingressos.
              </p>
            )}
            {pagamento.tipo === "PLANO" && (
              <p className="text-xs text-muted-foreground">
                Pagamento sócio.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
