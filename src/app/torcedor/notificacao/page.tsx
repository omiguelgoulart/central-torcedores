"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bell, AlertCircle, CheckCircle } from "lucide-react"

interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  tipo: "info" | "alerta" | "sucesso"
  timestamp: string
}

export default function NotificacoesPage() {
  const notificacoes: Notificacao[] = [
    {
      id: "1",
      titulo: "Ingresso confirmado",
      mensagem: "Seu ingresso para Pelotas x Grêmio foi confirmado",
      tipo: "sucesso",
      timestamp: "2025-10-08T14:30:00Z",
    },
    {
      id: "2",
      titulo: "Novo jogo disponível",
      mensagem: "Pelotas x Internacional já está disponível para compra",
      tipo: "info",
      timestamp: "2025-10-07T10:15:00Z",
    },
    {
      id: "3",
      titulo: "Cobrança próxima",
      mensagem: "Sua assinatura será cobrada em 3 dias. Verifique seu método de pagamento.",
      tipo: "alerta",
      timestamp: "2025-10-06T09:00:00Z",
    },
  ]

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "sucesso":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "alerta":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      default:
        return <Bell className="w-5 h-5 text-blue-400" />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return (
      date.toLocaleDateString("pt-BR") +
      " às " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Notificações</h1>
        <p className="text-zinc-400 text-sm mt-1">Fique atualizado sobre seus ingressos e assinatura</p>
      </div>

      <div className="space-y-3">
        {notificacoes.map((notificacao, index) => (
          <Card key={notificacao.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="px-6 py-4">
              <div className="flex gap-4">
                <div className="pt-1">{getIcon(notificacao.tipo)}</div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{notificacao.titulo}</p>
                  <p className="text-sm text-zinc-400 mt-1">{notificacao.mensagem}</p>
                  <p className="text-xs text-zinc-500 mt-2">{formatTime(notificacao.timestamp)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
