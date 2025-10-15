import { Users, Calendar, Ticket } from "lucide-react"

interface CounterBarProps {
  sociosAtivos: number
  jogosTemporada: number
  ingressosVendidos: number
}

export function CounterBar({ sociosAtivos, jogosTemporada, ingressosVendidos }: CounterBarProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  return (
    <section className="rounded-2xl p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="text-center space-y-2">
          <Users className="h-8 w-8 mx-auto" />
          <div className="text-4xl font-bold">{formatNumber(sociosAtivos)}+</div>
          <p>Sócios ativos</p>
        </div>

        <div className="text-center space-y-2">
          <Calendar className="h-8 w-8 mx-auto" />
          <div className="text-4xl font-bold">{formatNumber(jogosTemporada)}</div>
          <p>Jogos na temporada</p>
        </div>

        <div className="text-center space-y-2">
          <Ticket className="h-8 w-8 mx-auto" />
          <div className="text-4xl font-bold">{formatNumber(ingressosVendidos)}+</div>
          <p>Ingressos vendidos</p>
        </div>
      </div>
    </section>
  )
}
