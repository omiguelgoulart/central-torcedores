"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Breadcrumbs } from "@/components/partidas/BreadCrumbs"
import { ListaJogos } from "@/components/partidas/ListaJogos"

export default function PartidasPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* HERO / FAIXA COM BACKGROUND */}
      <section
        className="relative w-full h-[220px] sm:h-[260px] bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: "url('/fundoPartidas.jpeg')",
        }}
      >
      </section>

      {/* CONTEÚDO */}
      <section className="container mx-auto px-4 py-6 flex-1">
        <Breadcrumbs
          items={[
            { label: "Início", href: "/" },
            { label: "Partidas" },
          ]}
        />

        <div className="mt-6">
          <Card className="mx-auto border-none shadow-sm">
            {/* Título do card com subtítulo */}
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Próximas Partidas
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Separator className="mb-6" />
              {/* Lista de jogos */}
              <ListaJogos />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
