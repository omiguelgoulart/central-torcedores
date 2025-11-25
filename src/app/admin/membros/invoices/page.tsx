"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"

const invoices = [
  {
    id: 1,
    competencia: "2024-12",
    valor: "R$ 199,00",
    status: "PAGA",
    vencimento: "2024-12-20",
    torcedor: "João Silva",
  },
  {
    id: 2,
    competencia: "2024-11",
    valor: "R$ 199,00",
    status: "PAGA",
    vencimento: "2024-11-20",
    torcedor: "Maria Santos",
  },
  {
    id: 3,
    competencia: "2024-12",
    valor: "R$ 299,00",
    status: "ABERTA",
    vencimento: "2025-01-10",
    torcedor: "Pedro Costa",
  },
  {
    id: 4,
    competencia: "2024-12",
    valor: "R$ 199,00",
    status: "ATRASADA",
    vencimento: "2024-12-10",
    torcedor: "Ana Oliveira",
  },
]

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const openCount = invoices.filter((i) => i.status === "ABERTA" || i.status === "ATRASADA").length
  const paidCount = invoices.filter((i) => i.status === "PAGA").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Faturas</h1>
        <p className="text-muted-foreground">Gerenciar faturas de assinaturas</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pagas</p>
              <p className="text-2xl font-bold text-green-600">{paidCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pendentes/Atrasadas</p>
              <p className="text-2xl font-bold text-amber-600">{openCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Faturado</p>
              <p className="text-2xl font-bold text-primary">R$ 896,00</p>
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
                placeholder="Torcedor, competência..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Status</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>ABERTA</option>
                <option>PAGA</option>
                <option>ATRASADA</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Faturas</CardTitle>
        </CardHeader>
        <CardContent>
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
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{invoice.competencia}</td>
                    <td className="py-3">{invoice.torcedor}</td>
                    <td className="py-3 font-semibold text-primary">{invoice.valor}</td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(invoice.vencimento).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          invoice.status === "PAGA"
                            ? "default"
                            : invoice.status === "ATRASADA"
                              ? "destructive"
                              : "secondary"
                        }
                      >
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
