"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Zap } from "lucide-react"

export type Beneficio = {
  id: string
  slug: string
  titulo: string
  descricao?: string | null
  destaque: boolean
  ativo: boolean
  observacao?: string | null
}

type TabelaBeneficiosProps = {
  beneficios?: Beneficio[]
  onEditBeneficio?: (beneficio: Beneficio) => void
  onDeleteBeneficio?: (beneficio: Beneficio) => void
}

export function TabelaBeneficios({
  beneficios = [],
  onEditBeneficio,
  onDeleteBeneficio,
}: TabelaBeneficiosProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-muted-foreground text-xs">
            <th className="text-left py-3 font-medium">Título</th>
            <th className="text-left py-3 font-medium">Slug</th>
            <th className="text-left py-3 font-medium">Destaque</th>
            <th className="text-left py-3 font-medium">Status</th>
            <th className="text-left py-3 font-medium">Observação</th>
            <th className="text-left py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {beneficios.map((beneficio) => (
            <tr key={beneficio.id} className="hover:bg-muted/50">
              <td className="py-3 font-medium">{beneficio.titulo}</td>

              <td className="py-3 font-mono text-xs text-muted-foreground">
                {beneficio.slug}
              </td>

              <td className="py-3">
                {beneficio.destaque && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-xs">Destacado</span>
                  </div>
                )}
              </td>

              <td className="py-3">
                <Badge variant={beneficio.ativo ? "default" : "secondary"}>
                  {beneficio.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </td>

              <td className="py-3 max-w-xs text-xs text-muted-foreground">
                {beneficio.observacao ?? "-"}
              </td>

              <td className="py-3">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onEditBeneficio && onEditBeneficio(beneficio)
                    }
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() =>
                      onDeleteBeneficio && onDeleteBeneficio(beneficio)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {beneficios.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-4 text-center text-xs text-muted-foreground"
              >
                Nenhum benefício encontrado para este plano.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
