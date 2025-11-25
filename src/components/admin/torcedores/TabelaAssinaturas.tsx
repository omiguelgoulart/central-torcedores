"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit2 } from "lucide-react"

export type StatusAssinatura = "ATIVA" | "SUSPENSA" | "CANCELADA" | "OUTRO"

export type Assinatura = {
  id: string
  torcedor: string
  plano: string
  status: StatusAssinatura
  inicio: string | null
  proxima: string | null
  preco?: number | null
}

type TabelaAssinaturasProps = {
  assinaturas: Assinatura[]
  formatarData: (valor: string | null) => string
}

function badgeVariant(status: StatusAssinatura) {
  if (status === "ATIVA") return "default" as const
  if (status === "SUSPENSA") return "secondary" as const
  if (status === "CANCELADA") return "outline" as const
  return "outline" as const
}

export function TabelaAssinaturas({
  assinaturas,
  formatarData,
}: TabelaAssinaturasProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-muted-foreground text-xs">
            <th className="text-left py-3 font-medium">Torcedor</th>
            <th className="text-left py-3 font-medium">Plano</th>
            <th className="text-left py-3 font-medium">Status</th>
            <th className="text-left py-3 font-medium">Início</th>
            <th className="text-left py-3 font-medium">Próxima Cobrança</th>
            <th className="text-left py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {assinaturas.map((sub) => (
            <tr key={sub.id} className="hover:bg-muted/50">
              <td className="py-3 font-medium">{sub.torcedor}</td>
              <td className="py-3">{sub.plano}</td>
              <td className="py-3">
                <Badge variant={badgeVariant(sub.status)}>{sub.status}</Badge>
              </td>
              <td className="py-3 text-muted-foreground">
                {formatarData(sub.inicio)}
              </td>
              <td className="py-3 font-semibold">
                {formatarData(sub.proxima)}
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {assinaturas.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-6 text-center text-sm text-muted-foreground"
              >
                Nenhuma assinatura encontrada com os filtros atuais.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
