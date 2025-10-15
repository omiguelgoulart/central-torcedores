import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NoticiaPost {
  id: string
  titulo: string
  data: string
  thumb: string
}

interface ListaNoticiaProps {
  posts: NoticiaPost[]
}

export function ListaNoticias({ posts }: ListaNoticiaProps) {
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(data)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Notícias</h2>
        </div>
        <Button variant="link" asChild>
          <Link href="/noticias">Ver todas as notícias</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="hover:border transition-all group cursor-pointer"
          >
            <div className="relative h-32 w-full overflow-hidden rounded-t-xl">
              <Image
                src={post.thumb || "/placeholder.svg"}
                alt={post.titulo}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <CardContent className="p-4 space-y-2">
              <p className="text-xs">{formatarData(post.data)}</p>
              <h3 className="text-sm font-semibold line-clamp-2">{post.titulo}</h3>
              <Button variant="link" className="p-0 h-auto text-xs">
                Ler matéria
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
