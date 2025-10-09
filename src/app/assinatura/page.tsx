import { FormAssinatura } from "@/components/assinatura/FormAssinatura"
import { GridAssinatura } from "@/components/assinatura/GridAssinatura"
import { HeaderAssinatura } from "@/components/assinatura/HeaderAssinatura"
import type { Metadata } from "next"
import { Suspense } from "react"


export const metadata: Metadata = {
  title: "Assinatura - Central de Torcedores",
  description: "Complete sua assinatura e faça parte do clube.",
}

export default function AssinaturaPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <HeaderAssinatura />

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Suspense fallback={<div>Carregando...</div>}>
                <FormAssinatura />
              </Suspense>
            </div>

            <div className="lg:col-span-1">
              <Suspense fallback={<div>Carregando...</div>}>
                <GridAssinatura />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
