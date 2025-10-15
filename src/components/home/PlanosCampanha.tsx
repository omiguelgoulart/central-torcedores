import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard } from "lucide-react"
import Link from "next/link"

interface Plano {
  id: string
  nome: string
  descricao: string
  valor: number
  periodicidade: string
  destaque: boolean
  rotuloBadge?: string
  beneficios: string[]
}

interface PlanosCampanhaProps {
  planos: Plano[]
}

export function PlanosCampanha({ planos }: PlanosCampanhaProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Planos de Sócio</h2>
        </div>
        <Button variant="link" asChild>
          <Link href="/planos">Comparar todos os planos</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {planos.map((plano) => (
          <Card
            key={plano.id}
            className={`transition-all ${
              plano.destaque ? "ring-2" : ""
            }`}
          >
            <CardHeader>
              <div className="space-y-2">
                {plano.rotuloBadge && (
                  <Badge>{plano.rotuloBadge}</Badge>
                )}
                <CardTitle className="text-2xl">{plano.nome}</CardTitle>
                <p className="text-sm">{plano.descricao}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">R$ {plano.valor.toFixed(2).replace(".", ",")}</span>
                  <span>/{plano.periodicidade.toLowerCase()}</span>
                </div>
              </div>

              <ul className="space-y-2">
                {plano.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {beneficio}
                  </li>
                ))}
              </ul>

              <Button className="w-full">Assinar agora</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
