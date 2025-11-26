"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb"
import {
  AdminRole,
  AdminRow,
} from "@/components/admin/configuracoes/types"
import {
  AdminDialog,
  AdminFormValues,
} from "@/components/admin/configuracoes/AdminDialog"
import { AdminResumoCard } from "@/components/admin/configuracoes/AdminResumoCard"
import { AdminFiltroBusca } from "@/components/admin/configuracoes/AdminFiltroBusca"
import { AdminTabela } from "@/components/admin/configuracoes/AdminTabela"
import { useRouter } from "next/navigation"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type AdminApi = {
  id: string
  nome: string
  email: string
  criadoEm: string
  ativo?: boolean | null
  role?: string | null
}

function mapRole(role: string | null | undefined): AdminRole {
  if (role === "PORTARIA") return "PORTARIA"
  return "SUPER_ADMIN"
}

function mapFromApi(admin: AdminApi): AdminRow {
  return {
    id: admin.id,
    nome: admin.nome,
    email: admin.email,
    criadoEm: admin.criadoEm,
    ativo: admin.ativo ?? true,
    role: mapRole(admin.role),
  }
}

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [admins, setAdmins] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    async function carregarAdmins() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const res = await fetch(`${API}/admin/user`)
        if (!res.ok) {
          throw new Error("Erro ao buscar admins")
        }

        const data: AdminApi[] = await res.json()
        setAdmins(data.map(mapFromApi))
      } catch (error) {
        console.error(error)
        setErrorMessage(
          "Não foi possível carregar os administradores. Tente novamente mais tarde.",
        )
      } finally {
        setLoading(false)
      }
    }

    void carregarAdmins()
  }, [])

  const filteredAdmins = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return admins

    return admins.filter((admin) =>
      `${admin.nome} ${admin.email}`.toLowerCase().includes(term),
    )
  }, [admins, searchTerm])

  async function handleCreate(values: AdminFormValues) {
    try {
      setLoading(true)
      setErrorMessage(null)

      const res = await fetch(`${API}/admin/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: values.nome,
          email: values.email,
          senha: values.senha,
          role: values.role,
          ativo: values.ativo,
        }),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string; message?: string; errors?: Record<string, string[] | string> }
          | null

        // Monta mensagem mais detalhada a partir do corpo da resposta
        let detalhe = body?.error ?? body?.message ?? `Erro ${res.status} ${res.statusText}`

        if (body?.errors) {
          const partes = Object.values(body.errors)
        .flat()
        .filter(Boolean)
        .map(String)
          if (partes.length) detalhe += `: ${partes.join("; ")}`
        }

        setErrorMessage(`Não foi possível criar o administrador. ${detalhe}`)
        return
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      setErrorMessage("Erro ao criar administrador.")
    } finally {
      setLoading(false)
    }
  }

  async function handleEdit(id: string, values: AdminFormValues) {
    try {
      setLoading(true)
      setErrorMessage(null)

      const res = await fetch(`${API}/admin/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: values.nome,
          email: values.email,
          role: values.role,
          ativo: values.ativo,
          senha:
            values.senha && values.senha.trim() !== ""
              ? values.senha
              : undefined,
        }),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(body?.error ?? "Erro ao atualizar admin")
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      setErrorMessage("Erro ao atualizar administrador.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      setLoading(true)
      setErrorMessage(null)

      const res = await fetch(`${API}/admin/user/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(body?.error ?? "Erro ao deletar admin")
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      setErrorMessage("Erro ao deletar administrador.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Admins", href: "/admin/configuracoes/admins" },
        ]}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-balance">Admins</h1>
          <p className="text-muted-foreground">
            Gerencie usuários administradores e colaboradores de portaria.
          </p>
        </div>

        <AdminDialog mode="create" onSubmit={handleCreate}>
          <Button className="gap-2">
            Novo Admin
          </Button>
        </AdminDialog>
      </div>

      <AdminResumoCard total={admins.length} loading={loading} />

      <AdminFiltroBusca
        value={searchTerm}
        onChange={setSearchTerm}
        errorMessage={errorMessage}
      />

      <AdminTabela
        admins={filteredAdmins}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
