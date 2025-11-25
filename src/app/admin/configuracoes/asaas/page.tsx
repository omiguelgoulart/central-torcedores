"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Copy, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AsaasPage() {
  const [environment, setEnvironment] = useState("sandbox")
  const [showKey, setShowKey] = useState(false)

  const apiKey = "sk_test_1234567890abcdefghijklmnopqrstuvwxyz"
  const maskedKey = "sk_test_••••••••••••••••••••••••••••••"

  const webhookEndpoints = [
    { event: "payment.confirmed", url: "https://api.example.com/webhooks/payment-confirmed" },
    { event: "payment.received", url: "https://api.example.com/webhooks/payment-received" },
    { event: "payment.overpaid", url: "https://api.example.com/webhooks/payment-overpaid" },
    { event: "payment.failed", url: "https://api.example.com/webhooks/payment-failed" },
  ]

  const errorLogs = [
    {
      id: 1,
      timestamp: "2024-12-15 14:30",
      tipo: "Webhook Error",
      mensagem: "Falha ao processar webhook de pagamento",
      status: "ERRO",
    },
    {
      id: 2,
      timestamp: "2024-12-15 10:15",
      tipo: "Connection Error",
      mensagem: "Timeout ao conectar com API ASAAS",
      status: "ERRO",
    },
    {
      id: 3,
      timestamp: "2024-12-14 16:45",
      tipo: "Validation Error",
      mensagem: "Chave de API inválida ou expirada",
      status: "AVISO",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">ASAAS</h1>
        <p className="text-muted-foreground">Configuração e integração com gateway de pagamentos</p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs de Erro</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Environment */}
              <div>
                <Label className="mb-3 block">Ambiente</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="sandbox"
                      name="environment"
                      value="sandbox"
                      checked={environment === "sandbox"}
                      onChange={(e) => setEnvironment(e.target.value)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="sandbox" className="m-0 cursor-pointer">
                      Sandbox (Testes)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="production"
                      name="environment"
                      value="production"
                      checked={environment === "production"}
                      onChange={(e) => setEnvironment(e.target.value)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="production" className="m-0 cursor-pointer">
                      Produção
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Ambiente atual:{" "}
                  <Badge variant="outline">{environment === "sandbox" ? "SANDBOX" : "PRODUCTION"}</Badge>
                </p>
              </div>

              {/* API Key */}
              <div>
                <Label htmlFor="api-key" className="mb-2 block">
                  Chave de API
                </Label>
                <div className="flex gap-2">
                  <Input id="api-key" value={showKey ? apiKey : maskedKey} readOnly className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? "Ocultar" : "Mostrar"}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Guarde esta chave em local seguro. Nunca compartilhe publicamente.
                </p>
              </div>

              {/* Update Keys */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Para ir para produção, substitua as credenciais de teste pelas chaves de produção do ASAAS.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="prod-key" className="text-sm">
                    Chave de Produção
                  </Label>
                  <Input id="prod-key" placeholder="sk_live_..." className="font-mono text-xs" />
                </div>
              </div>

              <Button className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Atualizar Configuração
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Endpoints de Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure estes URLs no painel ASAAS para receber notificações de eventos.
              </p>
              <div className="space-y-3">
                {webhookEndpoints.map((webhook) => (
                  <div key={webhook.event} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{webhook.event}</p>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground break-all">{webhook.url}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Error Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-muted-foreground text-xs">
                      <th className="text-left py-3 font-medium">Timestamp</th>
                      <th className="text-left py-3 font-medium">Tipo</th>
                      <th className="text-left py-3 font-medium">Mensagem</th>
                      <th className="text-left py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {errorLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/50">
                        <td className="py-3 text-xs font-mono text-muted-foreground">{log.timestamp}</td>
                        <td className="py-3 font-medium">{log.tipo}</td>
                        <td className="py-3 text-muted-foreground text-xs">{log.mensagem}</td>
                        <td className="py-3">
                          <Badge variant={log.status === "ERRO" ? "destructive" : "secondary"}>{log.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
