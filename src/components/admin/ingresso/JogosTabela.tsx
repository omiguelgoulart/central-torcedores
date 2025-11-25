"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { formatBRL } from "@/lib/formatters"
import { JogoListaItem } from "./types"

type JogosTabelaProps = {
  jogos: JogoListaItem[]
}

export function JogosTabela({ jogos }: JogosTabelaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Lista de Jogos ({jogos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-muted-foreground text-xs">
                <th className="text-left py-3 font-medium">Jogo</th>
                <th className="text-left py-3 font-medium">Data</th>
                <th className="text-left py-3 font-medium">Pedidos</th>
                <th className="text-left py-3 font-medium">Reservas</th>
                <th className="text-left py-3 font-medium">Pendentes</th>
                <th className="text-left py-3 font-medium">Valor</th>
                <th className="text-left py-3 font-medium">Check-ins</th>
                <th className="text-left py-3 font-medium">Taxa</th>
                <th className="text-left py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jogos.map((jogo) => (
                <tr key={jogo.id} className="hover:bg-muted/50">
                  <td className="py-3 font-medium">{jogo.nome}</td>
                  <td className="py-3 text-muted-foreground text-xs">
                    {jogo.data} • {jogo.hora}
                  </td>
                  <td className="py-3 font-semibold">
                    {jogo.totalPedidos}
                  </td>
                  <td className="py-3">{jogo.reservasAtivas}</td>
                  <td className="py-3 text-amber-500">
                    {jogo.pendentesPagamento}
                  </td>
                  <td className="py-3 font-semibold text-primary">
                    {formatBRL(jogo.valorTotal)}
                  </td>
                  <td className="py-3 font-semibold">
                    {jogo.totalCheckins}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        jogo.taxaCheckin >= 90 ? "default" : "secondary"
                      }
                    >
                      {jogo.taxaCheckin}%
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Link href={`/admin/ingressos/${jogo.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}

              {jogos.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    Nenhum jogo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
