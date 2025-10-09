"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"

export function GridAssinatura() {
  const searchParams = useSearchParams()
  const planName = searchParams.get("plan") || "Plano não selecionado"
  const planPrice = searchParams.get("price") || "R$ 0,00"

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plano selecionado</span>
            <Badge variant="secondary">{planName}</Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Valor mensal</span>
            <span className="text-sm font-medium">{planPrice}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Taxa de adesão</span>
            <span className="text-sm font-medium text-green-600">Grátis</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold text-foreground">{planPrice}</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Cobrança recorrente mensal. Você pode cancelar a qualquer momento.
        </p>
      </CardContent>
    </Card>
  )
}
