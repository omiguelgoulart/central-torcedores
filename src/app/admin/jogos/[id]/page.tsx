"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("sectors")

  // Mock data
  const game = {
    id: params.id,
    name: "vs Time A",
    date: "2025-12-10",
    local: "Bento Freitas",
    descricao: "Jogo importante para o campeonato",
  }

  const sectors = [
    { id: 1, nome: "Arquibancada Sul", tipo: "ARQUIBANCADA", capacidade: 500, aberto: true, utilizado: 350 },
    { id: 2, nome: "Cadeira Premium", tipo: "CADEIRA", capacidade: 200, aberto: true, utilizado: 150 },
    { id: 3, nome: "Camarote", tipo: "CAMAROTE", capacidade: 100, aberto: false, utilizado: 0 },
  ]

  const lots = [
    {
      id: 1,
      nome: "Inteira - Fase 1",
      tipo: "INTEIRA",
      quantidade: 1000,
      preco: "R$ 80,00",
      vendas: 450,
      periodo: "01-15 Dec",
    },
    {
      id: 2,
      nome: "Meia - Fase 1",
      tipo: "MEIA",
      quantidade: 500,
      preco: "R$ 40,00",
      vendas: 280,
      periodo: "01-15 Dec",
    },
    { id: 3, nome: "Cortesia", tipo: "CORTESIA", quantidade: 100, preco: "Grátis", vendas: 45, periodo: "01-15 Dec" },
  ]

  const ingressos = [
    { id: 1, qrcode: "ABC123DEF", status: "VALIDO", torcedor: "João Silva", lote: "Inteira - Fase 1" },
    { id: 2, qrcode: "GHI456JKL", status: "USADO", torcedor: "Maria Santos", lote: "Inteira - Fase 1" },
    { id: 3, qrcode: "MNO789PQR", status: "PENDENTE", torcedor: "-", lote: "Meia - Fase 1" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">{game.name}</h1>
        <p className="text-muted-foreground">
          {new Date(game.date).toLocaleDateString("pt-BR")} • {game.local}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sectors">Setores</TabsTrigger>
          <TabsTrigger value="lots">Lotes</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
        </TabsList>

        {/* Setores Tab */}
        <TabsContent value="sectors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Setores do Jogo</h2>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Setor
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-muted-foreground text-xs">
                      <th className="text-left py-3 font-medium">Setor</th>
                      <th className="text-left py-3 font-medium">Tipo</th>
                      <th className="text-left py-3 font-medium">Capacidade</th>
                      <th className="text-left py-3 font-medium">Utilizado</th>
                      <th className="text-left py-3 font-medium">Status</th>
                      <th className="text-left py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sectors.map((sector) => (
                      <tr key={sector.id} className="hover:bg-muted/50">
                        <td className="py-3 font-medium">{sector.nome}</td>
                        <td className="py-3 text-muted-foreground text-xs">{sector.tipo}</td>
                        <td className="py-3">{sector.capacidade}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span>{sector.utilizado}</span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${(sector.utilizado / sector.capacidade) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant={sector.aberto ? "default" : "secondary"}>
                            {sector.aberto ? "Aberto" : "Fechado"}
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
        </TabsContent>

        {/* Lotes Tab */}
        <TabsContent value="lots" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Lotes de Ingressos</h2>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Lote
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-muted-foreground text-xs">
                      <th className="text-left py-3 font-medium">Nome</th>
                      <th className="text-left py-3 font-medium">Tipo</th>
                      <th className="text-left py-3 font-medium">Qtd</th>
                      <th className="text-left py-3 font-medium">Preço</th>
                      <th className="text-left py-3 font-medium">Vendas</th>
                      <th className="text-left py-3 font-medium">Período</th>
                      <th className="text-left py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {lots.map((lot) => (
                      <tr key={lot.id} className="hover:bg-muted/50">
                        <td className="py-3 font-medium">{lot.nome}</td>
                        <td className="py-3">
                          <Badge variant="outline">{lot.tipo}</Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">{lot.quantidade}</td>
                        <td className="py-3 font-semibold">{lot.preco}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-semibold">{lot.vendas}</span>
                            <span className="text-muted-foreground text-xs">
                              ({Math.round((lot.vendas / lot.quantidade) * 100)}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">{lot.periodo}</td>
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
        </TabsContent>

        {/* Ingressos Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ingressos Emitidos</h2>
            <div className="flex gap-2">
              <Input placeholder="Buscar QRCode..." className="w-48" />
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-muted-foreground text-xs">
                      <th className="text-left py-3 font-medium">QRCode</th>
                      <th className="text-left py-3 font-medium">Torcedor</th>
                      <th className="text-left py-3 font-medium">Lote</th>
                      <th className="text-left py-3 font-medium">Status</th>
                      <th className="text-left py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ingressos.map((ingresso) => (
                      <tr key={ingresso.id} className="hover:bg-muted/50">
                        <td className="py-3 font-mono text-xs">{ingresso.qrcode}</td>
                        <td className="py-3">{ingresso.torcedor}</td>
                        <td className="py-3 text-muted-foreground text-xs">{ingresso.lote}</td>
                        <td className="py-3">
                          <Badge
                            variant={
                              ingresso.status === "VALIDO"
                                ? "default"
                                : ingresso.status === "USADO"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {ingresso.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            Ver Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
