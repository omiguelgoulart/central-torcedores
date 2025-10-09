import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Trophy, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Trophy className="h-4 w-4" />
            Central de Torcedores
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Faça parte do nosso clube de torcedores
          </h1>

          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            Tenha acesso a benefícios exclusivos, descontos em produtos oficiais e experiências únicas com o seu time do
            coração.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/planos">
                Ver Planos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/assinatura">Assinar Agora</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-3">
          <Card className="border-primary/20 transition-all hover:border-primary/40 hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Benefícios Exclusivos</CardTitle>
              <CardDescription>
                Acesso antecipado a ingressos, descontos em produtos oficiais e conteúdo exclusivo dos bastidores.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 transition-all hover:border-primary/40 hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Comunidade Ativa</CardTitle>
              <CardDescription>
                Conecte-se com outros torcedores, participe de eventos VIP e tenha experiências inesquecíveis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 transition-all hover:border-primary/40 hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Planos Flexíveis</CardTitle>
              <CardDescription>
                Escolha o plano ideal para você, desde Bronze até Diamante, com benefícios crescentes.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-8">
              <h2 className="mb-4 text-balance text-2xl font-bold md:text-3xl">Pronto para fazer parte do clube?</h2>
              <p className="mb-6 text-muted-foreground">
                Escolha seu plano e comece a aproveitar todos os benefícios hoje mesmo.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href="/planos">
                  Conhecer os Planos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
