"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

export type StatusFatura = "ABERTA" | "PAGA" | "ATRASADA" | "OUTRO"

export type Fatura = {
  id: string
  competencia: string
  valorNumero: number
  valorFormatado: string
  status: StatusFatura
  vencimento: string | null
  torcedor: string
}

type TabelaFaturasProps = {
  faturas: Fatura[]
  formatarData: (valor: string | null) => string
}

function badgeVariant(status: StatusFatura) {
  if (status === "PAGA") return "default" as const
  if (status === "ATRASADA") return "destructive" as const
  if (status === "ABERTA") return "secondary" as const
  return "outline" as const
}

export function TabelaFaturas({ faturas, formatarData }: TabelaFaturasProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-muted-foreground text-xs">
            <th className="text-left py-3 font-medium">Competência</th>
            <th className="text-left py-3 font-medium">Torcedor</th>
            <th className="text-left py-3 font-medium">Valor</th>
            <th className="text-left py-3 font-medium">Vencimento</th>
            <th className="text-left py-3 font-medium">Status</th>
            <th className="text-left py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {faturas.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-muted/50">
              <td className="py-3 font-medium">{invoice.competencia}</td>
              <td className="py-3">{invoice.torcedor}</td>
              <td className="py-3 font-semibold text-primary">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(invoice.valorNumero)}
              </td>
              <td className="py-3 text-muted-foreground">
                {formatarData(invoice.vencimento)}
              </td>
              <td className="py-3">
                <Badge variant={badgeVariant(invoice.status)}>
                  {invoice.status}
                </Badge>
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {faturas.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-6 text-center text-sm text-muted-foreground"
              >
                Nenhuma fatura encontrada com os filtros atuais.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
