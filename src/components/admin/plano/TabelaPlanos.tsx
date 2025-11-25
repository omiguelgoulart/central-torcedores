"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2 } from "lucide-react"

export type peridiocidadePlano =
  | "MENSAL"
  | "TRIMESTRAL"
  | "SEMESTRAL"
  | "ANUAL"

export type Plano = {
  id: string
  nome: string
  valor: number
  periodicidade: peridiocidadePlano
  ativo: boolean
}

type TabelaPlanosProps = {
  planos?: Plano[]
  onEditPlano?: (plano: Plano) => void
  onDeletePlano?: (plano: Plano) => void
  onEditarBeneficios?: (plano: Plano) => void
}

const formatBRL = (value: number): string =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function TabelaPlanos({
  planos = [],
  onEditPlano,
  onDeletePlano,
  onEditarBeneficios,
}: TabelaPlanosProps) {
  return (
    <div className="overflow-x-auto ">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-muted-foreground text-xs">
            <th className="text-left py-3 font-medium">Nome</th>
            <th className="text-left py-3 font-medium">Valor</th>
            <th className="text-left py-3 font-medium">Periodicidade</th>
            <th className="text-left py-3 font-medium">Status</th>
            <th className="text-left py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {planos.map((plano) => (
            <tr key={plano.id} className="hover:bg-muted/50">
              <td className="py-3 font-medium">{plano.nome}</td>
              <td className="py-3 font-semibold text-primary">
                {formatBRL(plano.valor)}
              </td>
              <td className="py-3">
                <Badge variant="outline">{plano.periodicidade}</Badge>
              </td>

              <td className="py-3">
                <Badge variant={plano.ativo ? "default" : "secondary"}>
                  {plano.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </td>

              <td className="py-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPlano && onEditPlano(plano)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onEditarBeneficios && onEditarBeneficios(plano)
                    }
                  >
                    Benefícios
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => onDeletePlano && onDeletePlano(plano)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {planos.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-4 text-center text-xs text-muted-foreground"
              >
                Nenhum plano encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
