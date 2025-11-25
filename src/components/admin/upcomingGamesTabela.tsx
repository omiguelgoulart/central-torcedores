"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const games = [
  { id: 1, name: "vs Time A", date: "2025-12-10", status: "Ingressos Abertos", lotsOpen: 5 },
  { id: 2, name: "vs Time B", date: "2025-12-17", status: "Ingressos Abertos", lotsOpen: 3 },
  { id: 3, name: "vs Time C", date: "2025-12-24", status: "Planejamento", lotsOpen: 0 },
]

export function UpcomingGamesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Próximos Jogos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {games.map((game) => (
            <div key={game.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{game.name}</p>
                <p className="text-xs text-muted-foreground">{game.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={game.status === "Ingressos Abertos" ? "default" : "secondary"}>{game.status}</Badge>
                <span className="text-xs font-semibold text-primary">{game.lotsOpen} lotes</span>
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
