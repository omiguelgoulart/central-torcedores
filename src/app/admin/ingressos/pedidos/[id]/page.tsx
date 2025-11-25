"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Trash2 } from "lucide-react"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    torcedor: "João Silva",
    jogo: "vs Time A",
    status: "RESERVA_ATIVA",
    total: "R$ 360,00",
    criadoEm: "2025-12-08",
    expiraEm: "2025-12-10",
    pagamentoId: null,
  }

  const items = [
    { id: 1, tipo: "INTEIRA", setor: "Arquibancada Sul", preco: "R$ 180,00" },
    { id: 2, tipo: "MEIA", setor: "Arquibancada Sul", preco: "R$ 180,00" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedido #{order.id}</h1>
          <p className="text-muted-foreground">{order.torcedor}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Editar</Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Cancelar Pedido
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge className="mb-2">{order.status}</Badge>
            <p className="text-xs text-muted-foreground">Criado em: {order.criadoEm}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Expira em</p>
            <p className="text-xl font-bold">{order.expiraEm}</p>
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />2 dias restantes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold text-primary">{order.total}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jogo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold mb-2">{order.jogo}</p>
          <p className="text-muted-foreground">Data: 10 de Dezembro de 2025</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Tipo</th>
                  <th className="text-left py-3 font-medium">Setor</th>
                  <th className="text-left py-3 font-medium">Preço</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{item.tipo}</td>
                    <td className="py-3">{item.setor}</td>
                    <td className="py-3 font-semibold text-primary">{item.preco}</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          {order.pagamentoId ? (
            <p>Vinculado ao pagamento: {order.pagamentoId}</p>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Nenhum pagamento vinculado. Pedido aguardando confirmação.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
