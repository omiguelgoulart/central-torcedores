import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Ticket } from "lucide-react"
import Link from "next/link"

interface Jogo {
  id: string
  nome: string
  data: string
  local: string
  descricao: string
  hasLotes: boolean
}

interface FaixaDeJogosProps {
  jogos: Jogo[]
}

export function FaixaDeJogos({ jogos }: FaixaDeJogosProps) {
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(data)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Próximos Jogos</h2>
        </div>
        <Button variant="link" asChild>
          <Link href="/jogos">Ver todos os jogos</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {jogos.map((jogo) => (
          <Card key={jogo.id} className="hover:border transition-all">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{jogo.nome}</CardTitle>
                {jogo.hasLotes && <Badge>Disponível</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatarData(jogo.data)}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {jogo.local}
                </div>
                <p>{jogo.descricao}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  Detalhes
                </Button>
                {jogo.hasLotes && (
                  <Button size="sm" className="flex-1">
                    <Ticket className="h-4 w-4 mr-1" />
                    Comprar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
