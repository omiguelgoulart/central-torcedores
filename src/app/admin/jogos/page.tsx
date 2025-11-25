"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"

const jogos = [
  {
    id: 1,
    nome: "vs Time A",
    data: "2025-12-10",
    local: "Bento Freitas",
    status: "Ingressos Abertos",
    lotesAbertos: 5,
  },
  {
    id: 2,
    nome: "vs Time B",
    data: "2025-12-17",
    local: "Bento Freitas",
    status: "Ingressos Abertos",
    lotesAbertos: 3,
  },
  { id: 3, nome: "vs Time C", data: "2025-12-24", local: "Bento Freitas", status: "Planejamento", lotesAbertos: 0 },
]

export default function PaginaJogos() {
  const [termoBusca, setTermoBusca] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Jogos</h1>
          <p className="text-muted-foreground">Gerenciar eventos e lotes</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Jogo
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
                placeholder="Nome do jogo, data..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Período</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>Próximos 30 dias</option>
                <option>Próximos 90 dias</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Jogos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Nome</th>
                  <th className="text-left py-3 font-medium">Data</th>
                  <th className="text-left py-3 font-medium">Local</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Lotes</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jogos.map((jogo) => (
                  <tr key={jogo.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{jogo.nome}</td>
                    <td className="py-3 text-muted-foreground">{new Date(jogo.data).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3 text-muted-foreground">{jogo.local}</td>
                    <td className="py-3">
                      <Badge variant={jogo.status === "Ingressos Abertos" ? "default" : "secondary"}>
                        {jogo.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span className="text-primary font-semibold">{jogo.lotesAbertos}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/games/${jogo.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-destructive">
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
