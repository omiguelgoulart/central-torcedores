"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, CheckCircle2, AlertCircle } from "lucide-react"

const payments = [
  { id: 1, torcedor: "João Silva", valor: "R$ 199,00", status: "PAGO", metodo: "Pix", data: "2024-12-15" },
  { id: 2, torcedor: "Maria Santos", valor: "R$ 299,00", status: "PAGO", metodo: "Cartão", data: "2024-12-14" },
  { id: 3, torcedor: "Pedro Costa", valor: "R$ 199,00", status: "PENDENTE", metodo: "Boleto", data: "2024-12-20" },
  { id: 4, torcedor: "Ana Oliveira", valor: "R$ 199,00", status: "ATRASADO", metodo: "Boleto", data: "2024-12-10" },
  { id: 5, torcedor: "Carlos Silva", valor: "R$ 89,00", status: "PAGO", metodo: "Pix", data: "2024-12-13" },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const paidAmount = payments
    .filter((p) => p.status === "PAGO")
    .reduce((acc, p) => {
      const value = Number.parseFloat(p.valor.replace("R$ ", "").replace(",", "."))
      return acc + value
    }, 0)

  const pendingAmount = payments
    .filter((p) => p.status === "PENDENTE" || p.status === "ATRASADO")
    .reduce((acc, p) => {
      const value = Number.parseFloat(p.valor.replace("R$ ", "").replace(",", "."))
      return acc + value
    }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Pagamentos</h1>
        <p className="text-muted-foreground">Gerenciar transações e receitas</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Transações</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-muted" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pagos</p>
                <p className="text-2xl font-bold text-green-600">R$ {paidAmount.toFixed(2)}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-amber-600">R$ {pendingAmount.toFixed(2)}</p>
              </div>
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-primary">
                {((payments.filter((p) => p.status === "PAGO").length / payments.length) * 100).toFixed(0)}%
              </p>
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
                placeholder="Torcedor, valor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Status</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>PAGO</option>
                <option>PENDENTE</option>
                <option>ATRASADO</option>
              </select>
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Método</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>Pix</option>
                <option>Cartão</option>
                <option>Boleto</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Torcedor</th>
                  <th className="text-left py-3 font-medium">Valor</th>
                  <th className="text-left py-3 font-medium">Método</th>
                  <th className="text-left py-3 font-medium">Data</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{payment.torcedor}</td>
                    <td className="py-3 font-semibold text-primary">{payment.valor}</td>
                    <td className="py-3 text-muted-foreground text-xs">{payment.metodo}</td>
                    <td className="py-3 text-muted-foreground">{new Date(payment.data).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          payment.status === "PAGO"
                            ? "default"
                            : payment.status === "ATRASADO"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
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
