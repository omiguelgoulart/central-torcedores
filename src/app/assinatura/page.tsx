"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { IPlano, Periodicidade } from "@/app/types/planoItf"
import { ResumoPlano } from "@/components/assinatura/ResumoPlano"
import { FormAssinatura } from "@/components/assinatura/FormAssinatura"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

function AssinaturaContent() {
  const search = useSearchParams()
  const planoId = search.get("planoId")
  const defaultRecorrenciaParam = search.get(
    "defaultRecorrencia",
  ) as Periodicidade | null

  const [plano, setPlano] = useState<IPlano | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!planoId) {
      setLoading(false)
      setErrorMsg("Plano não informado. Volte e selecione um plano.")
      return
    }

    async function fetchPlano(): Promise<void> {
      try {
        setLoading(true)
        setErrorMsg(null)

        const res = await fetch(`${API}/planos/${encodeURIComponent(planoId as string)}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error("Erro ao buscar plano")
        }

        const data = (await res.json()) as IPlano
        setPlano(data)
      } catch (error) {
        console.error(error)
        setErrorMsg("Não foi possível carregar os dados do plano.")
      } finally {
        setLoading(false)
      }
    }

    void fetchPlano()
  }, [planoId])

  if (!planoId) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted-foreground">
          Não foi possível carregar os dados do plano. Volte e selecione um
          plano novamente.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted-foreground">Carregando plano...</p>
      </div>
    )
  }

  if (!plano || errorMsg) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted-foreground">
          {errorMsg ?? "Não foi possível carregar os dados do plano."}
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl gap-8 px-4 py-8 lg:flex">
      <div className="mb-8 w-full lg:mb-0 lg:w-1/2">
        <ResumoPlano plano={plano} />
      </div>

      <div className="w-full lg:w-1/2">
        <FormAssinatura
          planoId={plano.id}
          planoNome={plano.nome}
          valor={plano.valor}
          defaultRecorrencia={defaultRecorrenciaParam ?? plano.periodicidade}
        />
      </div>
    </div>
  )
}

export default function AssinaturaPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-muted-foreground">Carregando assinatura...</p>
        </div>
      }
    >
      <AssinaturaContent />
    </Suspense>
  )
}
