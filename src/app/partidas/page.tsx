"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <section className="p-4">
        <div className="mt-6">
          <Card className="mx-auto border-none bg-transparent shadow-none">
            {/* Título do card com subtítulo */}
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Próximas Partidas
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ListaJogos />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
