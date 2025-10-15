import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ticket, AlertCircle } from "lucide-react"

interface ingressoAProps {
  jogo: {
    nome: string
    data: string
  }
}

export function IngressoDisponivel({ jogo }: ingressoAProps) {
  return (
    <Card>
      <CardContent className="p-8 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Ticket className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Ingressos Disponíveis</h3>
          <p>
            Garanta seu lugar para <span className="font-semibold">{jogo.nome}</span>
          </p>
          <p className="text-lg font-semibold">A partir de R$ 25,00</p>
        </div>

        <Button size="lg">
          Garantir meu ingresso
        </Button>

        <div className="flex items-start gap-2 text-xs max-w-md mx-auto">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p className="text-left">Ingresso pessoal e intransferível. Apresente documento com foto na entrada.</p>
        </div>
      </CardContent>
    </Card>
  )
}
