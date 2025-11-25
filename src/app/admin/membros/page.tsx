"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"

const socios = [
  { id: 1, nome: "João Silva", email: "joao@example.com", cpf: "123.456.789-00", status: "ATIVO", plano: "Ouro" },
  { id: 2, nome: "Maria Santos", email: "maria@example.com", cpf: "987.654.321-11", status: "ATIVO", plano: "Platina" },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro@example.com",
    cpf: "456.789.123-22",
    status: "INADIMPLENTE",
    plano: "Bronze",
  },
  { id: 4, nome: "Ana Oliveira", email: "ana@example.com", cpf: "789.123.456-33", status: "ATIVO", plano: "Ouro" },
]

export default function PaginaTorcedores() {
  const [termoBusca, setTermoBusca] = useState("")

  const sociosAtivos = socios.filter((m) => m.status === "ATIVO").length
  const sociosInadimplentes = socios.filter((m) => m.status === "INADIMPLENTE").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Torcedores</h1>
          <p className="text-muted-foreground">Gerenciar sócios e membros</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Torcedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Torcedores</p>
                <p className="text-2xl font-bold">{socios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{sociosAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inadimplentes</p>
                <p className="text-2xl font-bold text-destructive">{sociosInadimplentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                placeholder="Nome, email, CPF..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Status</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>ATIVO</option>
                <option>INADIMPLENTE</option>
                <option>CANCELADO</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Torcedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Nome</th>
                  <th className="text-left py-3 font-medium">Email</th>
                  <th className="text-left py-3 font-medium">CPF</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Plano</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {socios.map((socio) => (
                  <tr key={socio.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{socio.nome}</td>
                    <td className="py-3 text-muted-foreground">{socio.email}</td>
                    <td className="py-3 font-mono text-xs">{socio.cpf}</td>
                    <td className="py-3">
                      <Badge variant={socio.status === "ATIVO" ? "default" : "destructive"}>{socio.status}</Badge>
                    </td>
                    <td className="py-3">{socio.plano}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/members/${socio.id}`}>
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
