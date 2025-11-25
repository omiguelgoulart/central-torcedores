"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Star } from "lucide-react"

const planos = [
  { id: 1, nome: "Bronze", valor: "R$ 99,00", periodicidade: "MENSAL", destaque: false, ativo: true },
  { id: 2, nome: "Ouro", valor: "R$ 199,00", periodicidade: "MENSAL", destaque: true, ativo: true },
  { id: 3, nome: "Platina", valor: "R$ 299,00", periodicidade: "MENSAL", destaque: true, ativo: true },
  { id: 4, nome: "Premium Anual", valor: "R$ 1.999,00", periodicidade: "ANUAL", destaque: false, ativo: true },
]

export default function PaginaPlanos() {
  const [termoBusca, setTermoBusca] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Planos</h1>
          <p className="text-muted-foreground">Gerenciar planos de assinatura</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Plano
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="busca" className="text-xs mb-1 block">
                Buscar
              </Label>
              <Input
                id="busca"
                placeholder="Nome do plano..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Periodicidade</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>MENSAL</option>
                <option>TRIMESTRAL</option>
                <option>SEMESTRAL</option>
                <option>ANUAL</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Planos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Nome</th>
                  <th className="text-left py-3 font-medium">Valor</th>
                  <th className="text-left py-3 font-medium">Periodicidade</th>
                  <th className="text-left py-3 font-medium">Destaque</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {planos.map((plano) => (
                  <tr key={plano.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{plano.nome}</td>
                    <td className="py-3 font-semibold text-primary">{plano.valor}</td>
                    <td className="py-3">
                      <Badge variant="outline">{plano.periodicidade}</Badge>
                    </td>
                    <td className="py-3">
                      {plano.destaque && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-xs">Destaque</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge variant={plano.ativo ? "default" : "secondary"}>{plano.ativo ? "Ativo" : "Inativo"}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
