"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit2, Eye } from "lucide-react"

const subscriptions = [
  { id: 1, torcedor: "João Silva", plano: "Ouro", status: "ATIVA", inicio: "2024-01-15", proxima: "2025-01-15" },
  { id: 2, torcedor: "Maria Santos", plano: "Platina", status: "ATIVA", inicio: "2024-03-20", proxima: "2025-03-20" },
  { id: 3, torcedor: "Pedro Costa", plano: "Bronze", status: "SUSPENSA", inicio: "2024-06-10", proxima: "-" },
  { id: 4, torcedor: "Ana Oliveira", plano: "Ouro", status: "CANCELADA", inicio: "2024-02-28", proxima: "-" },
]

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const activeCount = subscriptions.filter((s) => s.status === "ATIVA").length
  const suspendedCount = subscriptions.filter((s) => s.status === "SUSPENSA").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Assinaturas</h1>
          <p className="text-muted-foreground">Gerenciar assinaturas de planos</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{subscriptions.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ativas</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Suspensas</p>
              <p className="text-2xl font-bold text-amber-600">{suspendedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Receita Mensal</p>
              <p className="text-2xl font-bold text-primary">R$ 5.870</p>
            </div>
          </CardContent>
        </Card>
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
                placeholder="Torcedor, plano..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Status</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>ATIVA</option>
                <option>SUSPENSA</option>
                <option>CANCELADA</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Assinaturas</CardTitle>
        </CardHeader>
        <CardContent>
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
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{sub.torcedor}</td>
                    <td className="py-3">{sub.plano}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          sub.status === "ATIVA" ? "default" : sub.status === "SUSPENSA" ? "secondary" : "outline"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{new Date(sub.inicio).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3 font-semibold">
                      {sub.proxima !== "-" ? new Date(sub.proxima).toLocaleDateString("pt-BR") : "-"}
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
