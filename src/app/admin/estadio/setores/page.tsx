"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"

const sectors = [
  { id: 1, nome: "Arquibancada Sul", capacidade: 5000, tipo: "ARQUIBANCADA" },
  { id: 2, nome: "Arquibancada Norte", capacidade: 5500, tipo: "ARQUIBANCADA" },
  { id: 3, nome: "Cadeira Premium Leste", capacidade: 1000, tipo: "CADEIRA" },
  { id: 4, nome: "Camarote VIP", capacidade: 200, tipo: "CAMAROTE" },
]

export default function SectorsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const totalCapacity = sectors.reduce((acc, s) => acc + s.capacidade, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Setores do Estádio</h1>
          <p className="text-muted-foreground">Gerenciar capacidade e tipos de setores</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Setor
        </Button>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total de Setores</p>
              <p className="text-2xl font-bold">{sectors.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Capacidade Total</p>
              <p className="text-2xl font-bold">{totalCapacity.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Média por Setor</p>
              <p className="text-2xl font-bold">{Math.round(totalCapacity / sectors.length).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-xs mb-1 block">
                Buscar
              </Label>
              <Input
                id="search"
                placeholder="Nome do setor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Tipo</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>ARQUIBANCADA</option>
                <option>CADEIRA</option>
                <option>CAMAROTE</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sectors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Setores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Nome</th>
                  <th className="text-left py-3 font-medium">Tipo</th>
                  <th className="text-left py-3 font-medium">Capacidade</th>
                  <th className="text-left py-3 font-medium">% do Total</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sectors.map((sector) => (
                  <tr key={sector.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{sector.nome}</td>
                    <td className="py-3 text-muted-foreground text-xs">{sector.tipo}</td>
                    <td className="py-3 font-semibold">{sector.capacidade.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="text-primary font-semibold">
                        {((sector.capacidade / totalCapacity) * 100).toFixed(1)}%
                      </span>
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
