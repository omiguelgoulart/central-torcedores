"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const jogos = [
  { id: 1, nome: "vs Time A", data: "2025-12-10", status: "Ingressos Abertos", lotesAbertos: 5 },
  { id: 2, nome: "vs Time B", data: "2025-12-17", status: "Ingressos Abertos", lotesAbertos: 3 },
  { id: 3, nome: "vs Time C", data: "2025-12-24", status: "Planejamento", lotesAbertos: 0 },
]

export function TabelaProximosJogos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Próximos Jogos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jogos.map((jogo) => (
            <div key={jogo.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{jogo.nome}</p>
                <p className="text-xs text-muted-foreground">{jogo.data}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={jogo.status === "Ingressos Abertos" ? "default" : "secondary"}>{jogo.status}</Badge>
                <span className="text-xs font-semibold text-primary">{jogo.lotesAbertos} lotes</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          Ver Todos os Jogos
        </Button>
      </CardContent>
    </Card>
  )
}
