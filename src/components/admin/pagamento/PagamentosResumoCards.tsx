"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { PaymentRow, PaymentStatus } from "./types"
import { formatBRL } from "@/lib/formatters"

type PagamentosResumoCardsProps = {
  payments: PaymentRow[]
}

function isPendente(status: PaymentStatus) {
  return status === "PENDENTE" || status === "ATRASADO"
}

export function PagamentosResumoCards({ payments }: PagamentosResumoCardsProps) {
  const totalTransacoes = payments.length

  const paidAmount = payments
    .filter((p) => p.status === "PAGO")
    .reduce((acc, p) => acc + p.valor, 0)

  const pendingAmount = payments
    .filter((p) => isPendente(p.status))
    .reduce((acc, p) => acc + p.valor, 0)

  const successRate =
    totalTransacoes === 0
      ? 0
      : (payments.filter((p) => p.status === "PAGO").length /
          totalTransacoes) *
        100

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total de Transações
              </p>
              <p className="text-2xl font-bold">{totalTransacoes}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-muted" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pagos</p>
              <p className="text-2xl font-bold text-green-600">
                {formatBRL(paidAmount)}
              </p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-amber-600">
                {formatBRL(pendingAmount)}
              </p>
            </div>
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Taxa de Sucesso
            </p>
            <p className="text-2xl font-bold text-primary">
              {successRate.toFixed(0)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
