"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

type ResumoCardProps = {
  label: string
  value: string | number
  valueClassName?: string
}

export function ResumoCard({ label, value, valueClassName }: ResumoCardProps) {
  // palavras que indicam que deve ser exibido como moeda
  const camposFinanceiros = ["valor", "faturado", "receita", "total faturado"]

  const ehFinanceiro =
    typeof value === "number" &&
    camposFinanceiros.some((c) => label.toLowerCase().includes(c))

  const valorExibicao = ehFinanceiro
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value as number)
    : value

  return (
    <Card>
      <CardHeader>{label}</CardHeader>
      <CardContent className="pt-6">
        <div>
          <p className={`text-2xl font-bold ${valueClassName ?? ""}`}>
            {valorExibicao}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
