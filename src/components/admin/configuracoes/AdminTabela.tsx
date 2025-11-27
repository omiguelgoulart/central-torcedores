"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Mail } from "lucide-react"
import type { AdminRow, AdminRole } from "./types"
import { AdminDialog, AdminFormValues } from "./AdminDialog"

type AdminTabelaProps = {
  admins: AdminRow[]
  loading: boolean
  onEdit: (id: string, values: AdminFormValues) => void
  onDelete: (id: string) => void
}

function getRoleLabel(role: AdminRole): string {
  if (role === "SUPER_ADMIN") return "Administrador"
  if (role === "PORTARIA") return "Colaborador portaria"
  return role
}

export function AdminTabela({
  admins,
  loading,
  onEdit,
  onDelete,
}: AdminTabelaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Lista de Administradores ({admins.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Carregando administradores...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Nome</th>
                  <th className="text-left py-3 font-medium">Email</th>
                  <th className="text-left py-3 font-medium">Função</th>
                  <th className="text-left py-3 font-medium">Criado em</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{admin.nome}</td>
                    <td className="py-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{admin.email}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-muted-foreground">
                        {getRoleLabel(admin.role)}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(admin.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={admin.ativo ? "default" : "secondary"}
                      >
                        {admin.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <AdminDialog
                          mode="edit"
                          admin={admin}
                          onSubmit={(values) => onEdit(admin.id, values)}
                        >
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </AdminDialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => onDelete(admin.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && admins.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhum administrador encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
