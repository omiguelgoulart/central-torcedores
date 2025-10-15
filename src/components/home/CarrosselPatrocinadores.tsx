"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"

interface CarrosselPatrocinadoresProps {
  logos: string[]
}

export function CarrosselPatrocinadores({ logos }: CarrosselPatrocinadoresProps) {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Nossos Parceiros</h2>
        <p>Empresas que apoiam o clube</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {logos.map((logo, indice) => (
          <Card
            key={indice}
            className="p-6 flex items-center justify-center transition-all"
          >
            <Image
              src={logo || "/placeholder.svg"}
              alt={`Parceiro ${indice + 1}`}
              width={160}
              height={80}
              className="transition-opacity"
            />
          </Card>
        ))}
      </div>
    </section>
  )
}
