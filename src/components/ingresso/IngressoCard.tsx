import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ingressoItf } from '@/app/types/ingressoItf'

interface IngressoCardCompactProps {
  ingresso: ingressoItf
}

const statusConfig: Record<string, { label: string; className: string }> = {
  VALIDO: {
    label: 'Válido',
    className: 'bg-green-600 text-white',
  },
  USADO: {
    label: 'Usado',
    className: 'bg-gray-500 text-white',
  },
  CANCELADO: {
    label: 'Cancelado',
    className: 'bg-red-600 text-white',
  },
}

export function IngressoCardCompact({ ingresso }: IngressoCardCompactProps) {
  const status = statusConfig[ingresso.status] ?? {
    label: ingresso.status,
    className: 'bg-muted text-foreground',
  }

  const jogo = ingresso.jogo

  const dataFormatada = jogo?.dataHora
    ? new Date(jogo.dataHora).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Data indisponível'

  return (
    <Card className="border border-border bg-card hover:shadow-lg transition-all cursor-pointer rounded-lg">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg leading-tight text-foreground">
            {jogo?.mandante || 'Time'} <span className="text-muted-foreground">vs</span> {jogo?.visitante || 'Time'}
          </h3>

          <p className="text-sm text-muted-foreground mt-0.5">
            {dataFormatada}
          </p>

          {/* {ingresso.setor && (
            <p className="text-xs text-muted-foreground mt-1">
              Setor: <span className="font-medium text-foreground">{ingresso.setor}</span>
            </p>
          )} */}
        </div>

        <Badge className={`${status.className} px-3 py-1 text-xs rounded-md border-0`}>
          {status.label}
        </Badge>
      </CardContent>
    </Card>
  )
}
