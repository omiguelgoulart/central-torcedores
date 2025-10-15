import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Megaphone, Pin } from "lucide-react"
import Image from "next/image"

interface Comunicado {
  id: string
  titulo: string
  resumo: string
  capaUrl?: string
  tags: string[]
  fixado: boolean
  publicadoEm: string
}

interface FeedComunicadosProps {
  items: Comunicado[]
}

export function FeedComunicados({ items }: FeedComunicadosProps) {
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
      <div className="flex items-center gap-3">
        <Megaphone className="h-6 w-6 " />
        <h2 className="text-3xl font-bold ">Comunicados Oficiais</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card
            key={item.id}
            className={`border-zinc-800 bg-zinc-900/50 transition-all  ${
              item.fixado ? "ring-2 " : ""
            }`}
          >
            {item.capaUrl && (
              <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                <Image src={item.capaUrl || "/placeholder.svg"} alt={item.titulo} fill className="object-cover" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-white text-lg">{item.titulo}</CardTitle>
                {item.fixado && <Pin className="h-4 w-4  flex-shrink-0" />}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-400 text-sm">{item.resumo}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">{formatarData(item.publicadoEm)}</span>
                <Button variant="link" className=" p-0 h-auto">
                  Ler mais
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
