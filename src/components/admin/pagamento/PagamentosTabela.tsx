"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatBRL } from "@/lib/formatters"
import {
  PaymentRow,
  PaymentStatus,
  MetodoPagamentoApi,
} from "./types"
import { PagamentoDetalheDialog } from "./PagamentoDetalheDialog"

type PagamentosTabelaProps = {
  payments: PaymentRow[]
  loading: boolean
}

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

export function PagamentosTabela({ payments, loading }: PagamentosTabelaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Lista de Pagamentos ({payments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Carregando pagamentos...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Torcedor</th>
                  <th className="text-left py-3 font-medium">Valor</th>
                  <th className="text-left py-3 font-medium">Tipo</th>
                  <th className="text-left py-3 font-medium">Método</th>
                  <th className="text-left py-3 font-medium">Data</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">
                      {payment.torcedorNome}
                    </td>
                    <td className="py-3 font-semibold text-primary">
                      {formatBRL(Number(payment.valor))}
                    </td>
                    <td className="py-3 text-xs">
                      {getTipoLabel(payment)}
                      {payment.origemLabel && (
                        <span className="text-muted-foreground block">
                          {payment.origemLabel}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">
                      {humanizeMetodo(payment.metodo)}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {payment.data}
                    </td>
                    <td className="py-3">
                      <Badge variant={getStatusVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <PagamentoDetalheDialog pagamento={payment} />
                    </td>
                  </tr>
                ))}

                {!loading && payments.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhum pagamento encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
