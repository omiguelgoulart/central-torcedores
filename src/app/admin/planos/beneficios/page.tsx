"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Zap } from "lucide-react"

const benefits = [
  { id: 1, titulo: "Acesso ao Estádio", slug: "stadium-access", plano: "Bronze", ativo: true, destaque: true },
  { id: 2, titulo: "Desconto em Ingressos", slug: "ticket-discount", plano: "Bronze", ativo: true, destaque: false },
  { id: 3, titulo: "Camisa Oficial", slug: "official-shirt", plano: "Ouro", ativo: true, destaque: true },
  { id: 4, titulo: "Acesso VIP Camarote", slug: "vip-access", plano: "Platina", ativo: true, destaque: true },
  { id: 5, titulo: "Prioridade em Abonos", slug: "priority-tickets", plano: "Platina", ativo: true, destaque: false },
]

export default function BenefitsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Benefícios</h1>
          <p className="text-muted-foreground">Gerenciar benefícios por plano</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Benefício
        </Button>
      </div>

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
                placeholder="Nome do benefício..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Plano</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>Bronze</option>
                <option>Ouro</option>
                <option>Platina</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Benefícios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Título</th>
                  <th className="text-left py-3 font-medium">Slug</th>
                  <th className="text-left py-3 font-medium">Plano</th>
                  <th className="text-left py-3 font-medium">Destaque</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {benefits.map((benefit) => (
                  <tr key={benefit.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{benefit.titulo}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{benefit.slug}</td>
                    <td className="py-3">
                      <Badge variant="outline">{benefit.plano}</Badge>
                    </td>
                    <td className="py-3">
                      {benefit.destaque && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Zap className="w-4 h-4 fill-current" />
                          <span className="text-xs">Destacado</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge variant={benefit.ativo ? "default" : "secondary"}>
                        {benefit.ativo ? "Ativo" : "Inativo"}
                      </Badge>
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
