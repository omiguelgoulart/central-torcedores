"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

const orders = [
  {
    id: 1,
    torcedor: "João Silva",
    jogo: "vs Time A",
    status: "RESERVA_ATIVA",
    total: "R$ 360,00",
    itens: 2,
    expira: "2025-12-10",
  },
  { id: 2, torcedor: "Maria Santos", jogo: "vs Time B", status: "PAGO", total: "R$ 180,00", itens: 1, expira: "-" },
  {
    id: 3,
    torcedor: "Pedro Costa",
    jogo: "vs Time C",
    status: "PENDENTE_PAGAMENTO",
    total: "R$ 540,00",
    itens: 3,
    expira: "2025-12-11",
  },
  {
    id: 4,
    torcedor: "Ana Oliveira",
    jogo: "vs Time A",
    status: "RASCUNHO",
    total: "R$ 90,00",
    itens: 1,
    expira: "2025-12-12",
  },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const activeReserves = orders.filter((o) => o.status === "RESERVA_ATIVA").length
  const pendingPayment = orders.filter((o) => o.status === "PENDENTE_PAGAMENTO").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Pedidos</h1>
          <p className="text-muted-foreground">Gerenciar reservas e pedidos de ingressos</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total de Pedidos</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Reservas Ativas</p>
              <p className="text-2xl font-bold text-blue-600">{activeReserves}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pendente Pagamento</p>
              <p className="text-2xl font-bold text-amber-600">{pendingPayment}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-primary">R$ 1.170</p>
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
                placeholder="Torcedor, jogo, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Status</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>RASCUNHO</option>
                <option>RESERVA_ATIVA</option>
                <option>PENDENTE_PAGAMENTO</option>
                <option>PAGO</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Torcedor</th>
                  <th className="text-left py-3 font-medium">Jogo</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Itens</th>
                  <th className="text-left py-3 font-medium">Total</th>
                  <th className="text-left py-3 font-medium">Expira</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{order.torcedor}</td>
                    <td className="py-3">{order.jogo}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          order.status === "PAGO"
                            ? "default"
                            : order.status === "PENDENTE_PAGAMENTO"
                              ? "destructive"
                              : order.status === "RESERVA_ATIVA"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-center font-semibold">{order.itens}</td>
                    <td className="py-3 font-semibold text-primary">{order.total}</td>
                    <td className="py-3 text-muted-foreground text-xs">{order.expira !== "-" ? order.expira : "-"}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/tickets/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
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
