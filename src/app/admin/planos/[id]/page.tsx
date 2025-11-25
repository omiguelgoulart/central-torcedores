"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { useParams } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { TabelaBeneficios, Beneficio } from "@/components/admin/plano/TabelaBeneficios"
import { BeneficioDialog, BeneficioFormMode, BeneficioFormValues } from "@/components/admin/plano/BeneficioDialog"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type PlanoDetalheApi = {
  id: string
  nome: string
  descricao?: string | null
}

type BeneficioApi = {
  id: string
  slug: string
  titulo: string
  descricao?: string | null
  icone?: string | null
  ativo: boolean
  planoId: string
  destaque: boolean
  observacao?: string | null
}

export default function BeneficiosDoPlanoPage() {
  const params = useParams<{ id: string }>()
  const planoId = params.id

  const [plano, setPlano] = useState<PlanoDetalheApi | null>(null)
  const [beneficios, setBeneficios] = useState<Beneficio[]>([])
  const [busca, setBusca] = useState<string>("")
  const [carregando, setCarregando] = useState<boolean>(false)
  const [erro, setErro] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<BeneficioFormMode>("create")
  const [beneficioSelecionado, setBeneficioSelecionado] =
    useState<Beneficio | null>(null)
  const [salvando, setSalvando] = useState<boolean>(false)

  const carregarPlano = useCallback(async () => {
    try {
      const res = await fetch(`${API}/planos/${planoId}`)
      if (!res.ok) return
      const data = (await res.json()) as PlanoDetalheApi
      setPlano(data)
    } catch (error) {
      console.error(error)
    }
  }, [planoId])

  const carregarBeneficios = useCallback(async () => {
    try {
      setCarregando(true)
      setErro(null)

      const res = await fetch(`${API}/beneficio?planoId=${planoId}`)
      if (!res.ok) {
        console.error("Falha no GET /beneficio")
        setBeneficios([])
        return
      }

      const data = (await res.json()) as BeneficioApi[]
      if (!Array.isArray(data)) {
        setBeneficios([])
        return
      }

      const mapeados: Beneficio[] = data.map((b) => ({
        id: b.id,
        slug: b.slug,
        titulo: b.titulo,
        descricao: b.descricao ?? null,
        destaque: b.destaque,
        ativo: b.ativo,
        observacao: b.observacao ?? null,
      }))

      setBeneficios(mapeados)
    } catch (error) {
      console.error(error)
      setErro("Erro ao carregar benefícios da API.")
    } finally {
      setCarregando(false)
    }
  }, [planoId])

  useEffect(() => {
    if (!planoId) return
    void carregarPlano()
    void carregarBeneficios()
  }, [planoId, carregarPlano, carregarBeneficios])

  const beneficiosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase()
    return beneficios.filter((b) =>
      b.titulo.toLowerCase().includes(termo),
    )
  }, [beneficios, busca])

  async function handleSubmitBeneficio(values: BeneficioFormValues) {
    try {
      setSalvando(true)
      setErro(null)

      const payload = {
        slug: values.slug.trim(),
        titulo: values.titulo.trim(),
        descricao: values.descricao.trim() || undefined,
        icone: undefined,
        ativo: values.ativo,
        planoId,
        destaque: values.destaque,
        observacao: values.observacao.trim() || undefined,
      }

      if (dialogMode === "create") {
        const res = await fetch(`${API}/beneficio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const data = (await res
            .json()
            .catch(() => null)) as { error?: string } | null
          throw new Error(data?.error ?? "Erro ao criar benefício")
        }
      } else if (dialogMode === "edit" && beneficioSelecionado) {
        const res = await fetch(
          `${API}/beneficio/${beneficioSelecionado.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        )

        if (!res.ok) {
          const data = (await res
            .json()
            .catch(() => null)) as { error?: string } | null
          throw new Error(data?.error ?? "Erro ao atualizar benefício")
        }
      }

      await carregarBeneficios()
      setDialogOpen(false)
      setBeneficioSelecionado(null)
    } catch (error) {
      console.error(error)
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o benefício.",
      )
    } finally {
      setSalvando(false)
    }
  }

  async function handleDeleteBeneficio(beneficio: Beneficio) {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o benefício "${beneficio.titulo}"?`,
    )
    if (!confirmou) return

    try {
      setCarregando(true)
      setErro(null)

      const res = await fetch(`${API}/beneficio/${beneficio.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = (await res
          .json()
          .catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? "Erro ao excluir benefício")
      }

      await carregarBeneficios()
    } catch (error) {
      console.error(error)
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o benefício.",
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Benefícios Plano {plano?.nome ?? "Carregando..."}
          </h1>
          <p className="text-muted-foreground">
            Gerencie os benefícios exclusivos deste plano.
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() => {
            setDialogMode("create")
            setBeneficioSelecionado(null)
            setDialogOpen(true)
          }}
        >
          Novo Benefício
        </Button>
      </div>

      {/* Filtro */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-xs mb-1 block">Buscar</Label>
              <Input
                placeholder="Título do benefício..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          {carregando && (
            <p className="mt-3 text-xs text-muted-foreground">
              Carregando benefícios da API...
            </p>
          )}

          {erro && (
            <p className="mt-3 text-xs text-destructive">
              {erro}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Benefícios do plano ({beneficiosFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabelaBeneficios
            beneficios={beneficiosFiltrados}
            onEditBeneficio={(beneficio) => {
              setBeneficioSelecionado(beneficio)
              setDialogMode("edit")
              setDialogOpen(true)
            }}
            onDeleteBeneficio={handleDeleteBeneficio}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <BeneficioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={beneficioSelecionado}
        onSubmit={handleSubmitBeneficio}
        submitting={salvando}
      />
    </div>
  )
}
