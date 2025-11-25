"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, Download } from "lucide-react"

const checkins = [
  {
    id: 1,
    jogo: "vs Time A",
    horario: "19:00",
    portao: "A1",
    operador: "Admin 1",
    total: 2890,
    checkins: 2745,
    taxa: "95%",
  },
  {
    id: 2,
    jogo: "vs Time B",
    horario: "20:30",
    portao: "A2",
    operador: "Admin 2",
    total: 1200,
    checkins: 1050,
    taxa: "87%",
  },
  { id: 3, jogo: "vs Time C", horario: "-", portao: "-", operador: "-", total: 0, checkins: 0, taxa: "0%" },
]

export default function CheckinsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const totalCheckins = checkins.reduce((acc, c) => acc + c.checkins, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Check-ins</h1>
        <p className="text-muted-foreground">Controle de entrada nos eventos</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total de Check-ins</p>
              <p className="text-2xl font-bold">{totalCheckins}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taxa Média</p>
              <p className="text-2xl font-bold text-green-600">92%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Jogos com Check-in</p>
              <p className="text-2xl font-bold">{checkins.filter((c) => c.checkins > 0).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-xs mb-1 block">
                Buscar
              </Label>
              <Input
                id="search"
                placeholder="Jogo, operador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Label className="text-xs mb-1 block">Status</Label>
              <select className="w-full px-3 py-2 border border-input rounded-lg text-sm">
                <option>Todos</option>
                <option>Realizado</option>
                <option>Agendado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Check-ins por Jogo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Jogo</th>
                  <th className="text-left py-3 font-medium">Horário</th>
                  <th className="text-left py-3 font-medium">Portão</th>
                  <th className="text-left py-3 font-medium">Operador</th>
                  <th className="text-left py-3 font-medium">Total</th>
                  <th className="text-left py-3 font-medium">Check-ins</th>
                  <th className="text-left py-3 font-medium">Taxa</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {checkins.map((checkin) => (
                  <tr key={checkin.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{checkin.jogo}</td>
                    <td className="py-3 text-muted-foreground">{checkin.horario}</td>
                    <td className="py-3">{checkin.portao}</td>
                    <td className="py-3 text-muted-foreground">{checkin.operador}</td>
                    <td className="py-3 font-semibold">{checkin.total}</td>
                    <td className="py-3 font-semibold text-primary">{checkin.checkins}</td>
                    <td className="py-3">
                      <Badge variant={Number.parseInt(checkin.taxa) >= 90 ? "default" : "secondary"}>
                        {checkin.taxa}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
