import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface Depoimento {
  nome: string
  texto: string
}

interface DepoimentosProps {
  depoimentos: Depoimento[]
}

export function Depoimentos({ depoimentos }: DepoimentosProps) {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">O que dizem nossos sócios</h2>
        <p>Experiências reais de quem já faz parte</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {depoimentos.map((depoimento, index) => (
          <Card key={index}>
            <CardContent className="p-6 space-y-4">
              <Quote className="h-8 w-8" />
              <p className="italic">{depoimento.texto}</p>
              <p className="text-sm font-semibold">— {depoimento.nome}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
