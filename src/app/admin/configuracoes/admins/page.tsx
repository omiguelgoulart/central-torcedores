"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb"
import { AdminRole, AdminRow } from "@/components/admin/configuracoes/types"
import { AdminDialog, AdminFormValues } from "@/components/admin/configuracoes/AdminDialog"
import { AdminResumoCard } from "@/components/admin/configuracoes/AdminResumoCard"
import { AdminFiltroBusca } from "@/components/admin/configuracoes/AdminFiltroBusca"
import { AdminTabela } from "@/components/admin/configuracoes/AdminTabela"

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
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [admins, setAdmins] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    async function carregarAdmins(): Promise<void> {
      try {
        setLoading(true)
        setErrorMessage(null)

        const res = await fetch(`${API}/admin/user`, { cache: "no-store" })

        if (!res.ok) {
          throw new Error("Erro ao buscar admins")
        }

        const data = (await res.json()) as AdminApi[]
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

  const filteredAdmins = useMemo<AdminRow[]>(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return admins

    return admins.filter((admin) =>
      `${admin.nome} ${admin.email}`.toLowerCase().includes(term),
    )
  }, [admins, searchTerm])

  async function handleCreate(values: AdminFormValues): Promise<void> {
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
          | {
              error?: string
              message?: string
              errors?: Record<string, string[] | string>
            }
          | null

        let detalhe =
          body?.error ??
          body?.message ??
          `Erro ${res.status} ${res.statusText}`

        if (body?.errors) {
          const partes = Object.values(body.errors)
            .flat()
            .filter(Boolean)
            .map((msg) => String(msg))

          if (partes.length > 0) {
            detalhe += `: ${partes.join("; ")}`
          }
        }

        setErrorMessage(
          `Não foi possível criar o administrador. ${detalhe}`,
        )
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

  async function handleEdit(
    id: string,
    values: AdminFormValues,
  ): Promise<void> {
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
        const mensagemErro = body?.error ?? "Erro ao atualizar admin"
        throw new Error(mensagemErro)
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      setErrorMessage("Erro ao atualizar administrador.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string): Promise<void> {
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
        const mensagemErro = body?.error ?? "Erro ao deletar admin"
        throw new Error(mensagemErro)
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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-balance text-3xl font-bold">Admins</h1>
          <p className="text-muted-foreground">
            Gerencie usuários administradores e colaboradores de portaria.
          </p>
        </div>

        <AdminDialog mode="create" onSubmit={handleCreate}>
          <Button className="gap-2">Novo Admin</Button>
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
