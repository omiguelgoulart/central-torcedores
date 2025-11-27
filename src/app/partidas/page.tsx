"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListaJogos } from "@/components/partidas/ListaJogos"
import type { Jogo } from "@/components/partidas/CardJogo"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

export default function PartidasPage() {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`${API}/admin/jogo`, {
          cache: "no-store",
        })

        if (!res.ok) throw new Error("Erro ao buscar jogos")

        const data = await res.json()
        setJogos(data)
      } catch (error) {
        console.error("Erro ao carregar jogos:", error)
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      {/* HERO */}
      <section
        className="w-full h-58 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/torcida.jpeg')" }}
      />

      {/* CONTEÚDO */}
      <section className="p-4">
        <div className="mt-6">
          <Card className="mx-auto border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Próximas Partidas
              </CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground">
                  Carregando partidas…
                </p>
              ) : (
                <ListaJogos jogos={jogos} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
