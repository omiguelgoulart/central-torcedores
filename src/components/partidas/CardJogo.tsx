import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export interface Jogo {
  id: string
  nome: string
  data: string
  local: string
  descricao?: string
  status?: string
}

export function JogoCard({ jogo }: { jogo: Jogo }) {
  const dataObj = new Date(jogo.data)

  const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="text-left hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{jogo.nome}</CardTitle>

        {jogo.status && (
          <CardDescription className="text-xs">
            {jogo.status}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{dataFormatada}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>{horaFormatada}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{jogo.local}</span>
          </div>
        </div>

        <Link href={`/partidas/${jogo.id}`}>
          <Button className="w-full rounded-xl">Comprar ingressos</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
