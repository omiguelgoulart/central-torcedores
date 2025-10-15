import { Card, CardContent } from "@/components/ui/card"
import { Timer, Percent, Shield, QrCode, Trophy, DollarSign } from "lucide-react"

interface Beneficio {
  titulo: string
  icone: string
}

interface BeneficiosDestaqueProps {
  beneficios: Beneficio[]
}

const mapaIcones = {
  Timer,
  Percent,
  Shield,
  QrCode,
  Trophy,
  DollarSign,
}

export function BeneficiosDestaque({ beneficios }: BeneficiosDestaqueProps) {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Benefícios Exclusivos</h2>
        <p>Vantagens que fazem a diferença para você</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beneficios.map((beneficio, index) => {
          const Icone = mapaIcones[beneficio.icone as keyof typeof mapaIcones] || Shield
          return (
            <Card key={index}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0">
                  <Icone className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{beneficio.titulo}</h3>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
