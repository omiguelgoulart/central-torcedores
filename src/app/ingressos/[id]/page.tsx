'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { ingressoItf } from '@/app/types/ingressoItf'

const mockIngressos: Record<string, ingressoItf> = {
  '1': {
    id: '1',
    torcedorId: 'user-123',
    jogoId: 'jogo-001',
    loteId: 'lote-001',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=INGRESSO-001',
    valor: '150.00',
    status: 'VALIDO',
    criadoEm: '2025-01-15T10:30:00Z',
    usadoEm: null,
    atualizadoEm: '2025-01-15T10:30:00Z',
    pagamentoId: 'pag-001',
    jogo: {
      id: 'jogo-001',
      mandante: 'Cruzeiro',
      visitante: 'Atlético Mineiro',
      dataHora: '2025-02-01T20:00:00Z',
      estadio: 'Mineirão',
    },
    lote: {
      id: 'lote-001',
      nome: 'Portaria F',
      setor: 'Setor azul',
      descricao: 'Acesso pela Portaria F',
    },
  },
  '2': {
    id: '2',
    torcedorId: 'user-123',
    jogoId: 'jogo-002',
    loteId: 'lote-002',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=INGRESSO-002',
    valor: '120.00',
    status: 'USADO',
    criadoEm: '2024-12-20T15:45:00Z',
    usadoEm: '2025-01-10T19:30:00Z',
    atualizadoEm: '2025-01-10T19:30:00Z',
    pagamentoId: 'pag-002',
    jogo: {
      id: 'jogo-002',
      mandante: 'Cruzeiro',
      visitante: 'Flamengo',
      dataHora: '2025-01-10T19:00:00Z',
      estadio: 'Mineirão',
    },
    lote: {
      id: 'lote-002',
      nome: 'Portaria E',
      setor: 'Setor azul',
      descricao: 'Acesso pela Portaria E',
    },
  },
  '3': {
    id: '3',
    torcedorId: 'user-123',
    jogoId: 'jogo-003',
    loteId: 'lote-003',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=INGRESSO-003',
    valor: '180.00',
    status: 'CANCELADO',
    criadoEm: '2024-11-10T08:15:00Z',
    usadoEm: null,
    atualizadoEm: '2024-11-25T14:20:00Z',
    pagamentoId: 'pag-003',
    jogo: {
      id: 'jogo-003',
      mandante: 'Cruzeiro',
      visitante: 'Grêmio',
      dataHora: '2024-12-05T18:00:00Z',
      estadio: 'Mineirão',
    },
    lote: {
      id: 'lote-003',
      nome: 'Portaria D',
      setor: 'Setor azul',
      descricao: 'Acesso pela Portaria D',
    },
  },
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

export default function IngressoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const ingressoId = params.id as string
  const ingresso = mockIngressos[ingressoId]

  if (!ingresso) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Ingresso não encontrado</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </main>
    )
  }

  const status = statusConfig[ingresso.status]
  const jogo = ingresso.jogo
  const lote = ingresso.lote

  const dataFormatada = jogo?.dataHora
    ? new Date(jogo.dataHora).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      })
    : 'Data indisponível'

  const horaFormatada = jogo?.dataHora
    ? new Date(jogo.dataHora).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Hora indisponível'

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full h-full px-4 py-6 md:py-12 md:px-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card className="overflow-hidden border border-border bg-card">
            <CardHeader className="bg-red-600 text-white pb-4 md:pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl">
                    {jogo?.mandante || 'Time'} vs {jogo?.visitante || 'Time'}
                  </CardTitle>
                  <CardDescription className="text-red-100">Seu Ingresso</CardDescription>
                </div>
                <Badge className={`${status.className} border-0 text-sm w-fit`}>{status.label}</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 md:pt-8 space-y-6 md:space-y-8">
              {/* Informações do Jogo */}
              <div className="space-y-4 pb-6 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Data e Hora</p>
                    <p className="text-base md:text-lg font-semibold text-foreground capitalize">{dataFormatada}</p>
                    <p className="text-foreground font-medium">{horaFormatada}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estádio</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">{jogo?.estadio || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Informações do Lote/Setor */}
              <div className="space-y-4 pb-6 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Setor</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">{lote?.setor || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Portaria</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">{lote?.nome || 'Não informado'}</p>
                  </div>
                </div>
                {lote?.descricao && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Instrução de Acesso</p>
                    <p className="text-foreground">{lote.descricao}</p>
                  </div>
                )}
              </div>

              {/* Valor */}
              <div className="pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-1">Valor</p>
                <p className="text-3xl md:text-4xl font-bold text-red-600">R$ {ingresso.valor}</p>
              </div>

              {/* QR Code Grande */}
              <div className="flex flex-col items-center space-y-3">
                <p className="text-sm text-muted-foreground">Código de Acesso</p>
                <div className="bg-muted p-6 md:p-8 rounded-lg">
                  <Image
                    src={ingresso.qrCode || '/placeholder.svg'}
                    alt="QR Code do ingresso"
                    width={250}
                    height={250}
                    className="rounded w-48 h-48 md:w-64 md:h-64"
                    unoptimized
                    priority
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  ID do Ingresso: <span className="font-mono font-semibold text-foreground">{ingresso.id}</span>
                </p>
              </div>

              {/* Data de criação/uso */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                <p>Adquirido em: {new Date(ingresso.criadoEm).toLocaleDateString('pt-BR')}</p>
                {ingresso.usadoEm && (
                  <p>Utilizado em: {new Date(ingresso.usadoEm).toLocaleDateString('pt-BR')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
