import { GridPlano } from "@/components/planos/GridPlano"
import { HeaderPlano } from "@/components/planos/HeaderPlano"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Planos - Central de Torcedores",
  description: "Escolha o plano ideal para você e faça parte do clube.",
}

export default function PlanosPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <HeaderPlano />
        <GridPlano />
      </div>
    </div>
  )
}
