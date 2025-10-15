import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface AnuncioHeroProps {
  titulo: string
  subtitulo: string
  midia: { tipo: string; url: string }
  acoes: Array<{ rotulo: string; acao: string }>
  fixado?: boolean
}

export function Anuncio({ titulo, subtitulo, midia, acoes, fixado }: AnuncioHeroProps) {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={midia.url || "/placeholder.svg"}
          alt={titulo}
          fill
          className="object-cover brightness-50"
        />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          {fixado && <Badge>Fixado</Badge>}

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {titulo}
          </h1>

          <p className="text-xl md:text-2xl text-zinc-200">{subtitulo}</p>

          <div className="flex flex-wrap gap-3">
            {acoes.map((acao, indice) => (
              <Button key={indice} size="lg">
                {acao.rotulo}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
