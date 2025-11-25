"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

export type StatusSocio = "ATIVO" | "INADIMPLENTE" | "CANCELADO"

export type Socio = {
  id: string
  nome: string
  email: string
  cpf: string
  status: StatusSocio
  plano: string
}

type TabelaTorcedoresProps = {
  socios: Socio[]
}

function variantStatus(status: StatusSocio) {
  if (status === "ATIVO") return "default" as const
  if (status === "INADIMPLENTE") return "destructive" as const
  return "outline" as const
}

export function TabelaTorcedores({ socios }: TabelaTorcedoresProps) {
  return (
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
                <Badge variant={variantStatus(socio.status)}>{socio.status}</Badge>
              </td>
              <td className="py-3">{socio.plano}</td>
              <td className="py-3">
                <div className="flex gap-2">
                  <Link href={`/admin/torcedores/${socio.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {socios.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-6 text-center text-sm text-muted-foreground"
              >
                Nenhum torcedor encontrado com os filtros atuais.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
