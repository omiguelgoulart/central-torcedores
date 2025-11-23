import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { ingressoItf } from '@/app/types/ingressoItf'

interface IngressoCardProps {
  ingresso: ingressoItf
  isLink?: boolean
}

const statusConfig = {
  VALIDO: {
    label: 'Válido',
    className: 'bg-red-600 text-white hover:bg-red-700',
  },
  USADO: {
    label: 'Usado',
    className: 'bg-gray-500 text-white hover:bg-gray-600',
  },
  CANCELADO: {
    label: 'Cancelado',
    className: 'bg-red-500 text-white hover:bg-red-600',
  },
}

export function IngressoCard({ ingresso, isLink = false }: IngressoCardProps) {
  const status = statusConfig[ingresso.status]
  const jogo = ingresso.jogo
  const lote = ingresso.lote

  const dataFormatada = jogo?.dataHora
    ? new Date(jogo.dataHora).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Data indisponível'

  const horaFormatada = jogo?.dataHora
    ? new Date(jogo.dataHora).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Hora indisponível'

  return (
    <Card className={`overflow-hidden border border-border bg-card ${isLink ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}>
      <CardHeader className="bg-red-600 text-white pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{jogo?.mandante || 'Time'} vs {jogo?.visitante || 'Time'}</CardTitle>
            <CardDescription className="text-red-100">Jogo</CardDescription>
          </div>
          <Badge className={`${status.className} border-0`}>{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Informações do Jogo */}
        <div className="space-y-3 pb-4 border-b border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data:</span>
            <span className="font-medium text-foreground">{dataFormatada}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Horário:</span>
            <span className="font-medium text-foreground">{horaFormatada}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estádio:</span>
            <span className="font-medium text-foreground">{jogo?.estadio || 'Não informado'}</span>
          </div>
        </div>

        {/* Informações do Lote/Setor */}
        <div className="space-y-2 pb-4 border-b border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Setor:</span>
            <span className="font-medium text-foreground">{lote?.setor || 'Não informado'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Portaria:</span>
            <span className="font-medium text-foreground">{lote?.nome || 'Não informado'}</span>
          </div>
          {lote?.descricao && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Acesso:</span>
              <span className="font-medium text-foreground">{lote.descricao}</span>
            </div>
          )}
        </div>

        {/* Valor */}
        <div className="flex justify-between text-sm pb-4 border-b border-border">
          <span className="text-muted-foreground">Valor:</span>
          <span className="font-bold text-red-600">R$ {ingresso.valor}</span>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-muted p-3 rounded-md">
            <Image
              src={ingresso.qrCode || '/placeholder.svg'}
              alt="QR Code do ingresso"
              width={120}
              height={120}
              className="rounded"
              unoptimized
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
