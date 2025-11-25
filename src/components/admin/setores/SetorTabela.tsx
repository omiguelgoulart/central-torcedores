"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"
import type { Setor } from "./types"

type SetorTabelaProps = {
  setores: Setor[]
  capacidadeTotal: number
  onEditar: (setor: Setor) => void
  onExcluir: (id: number) => void
}

export function SetorTabela({
  setores,
  capacidadeTotal,
  onEditar,
  onExcluir,
}: SetorTabelaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Lista de setores ({setores.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-muted-foreground text-xs">
                <th className="text-left py-3 font-medium">Nome</th>
                <th className="text-left py-3 font-medium">Tipo</th>
                <th className="text-left py-3 font-medium">Capacidade</th>
                <th className="text-left py-3 font-medium">% do total</th>
                <th className="text-left py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {setores.map((setor) => (
                <tr key={setor.id} className="hover:bg-muted/50">
                  <td className="py-3 font-medium">{setor.nome}</td>
                  <td className="py-3 text-muted-foreground text-xs">
                    {setor.tipo}
                  </td>
                  <td className="py-3 font-semibold">
                    {setor.capacidade.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3">
                    <span className="text-primary font-semibold">
                      {capacidadeTotal
                        ? (
                            (setor.capacidade / capacidadeTotal) *
                            100
                          ).toFixed(1)
                        : "0.0"}
                      %
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditar(setor)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => onExcluir(setor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {setores.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-muted-foreground text-sm"
                  >
                    Nenhum setor encontrado com os filtros atuais.
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
