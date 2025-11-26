"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Mail } from "lucide-react"
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb"

const admins = [
  { id: 1, nome: "Admin Principal", email: "admin@example.com", criadoEm: "2024-01-01", ativo: true },
  { id: 2, nome: "Admin Operacional", email: "operacional@example.com", criadoEm: "2024-03-15", ativo: true },
  { id: 3, nome: "Admin Financeiro", email: "financeiro@example.com", criadoEm: "2024-06-20", ativo: true },
]

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
              items={[
                { label: "Dashboard", href: "/admin" },
                { label: "Admins", href: "/admin/configuracoes/admins" },
              ]}
            />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Admins</h1>
          <p className="text-muted-foreground">Gerenciar usuários administradores</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Admin
        </Button>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total de Administradores</p>
            <p className="text-2xl font-bold">{admins.length}</p>
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
                placeholder="Nome, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Administradores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Nome</th>
                  <th className="text-left py-3 font-medium">Email</th>
                  <th className="text-left py-3 font-medium">Criado em</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{admin.nome}</td>
                    <td className="py-3 text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {admin.email}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(admin.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3">
                      <Badge variant={admin.ativo ? "default" : "secondary"}>{admin.ativo ? "Ativo" : "Inativo"}</Badge>
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
