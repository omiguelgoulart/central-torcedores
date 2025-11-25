"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const dados = [
  { mes: "Jan", receita: 45000, meta: 50000 },
  { mes: "Fev", receita: 52000, meta: 50000 },
  { mes: "Mar", receita: 48000, meta: 50000 },
  { mes: "Abr", receita: 61000, meta: 50000 },
  { mes: "Mai", receita: 55000, meta: 50000 },
  { mes: "Jun", receita: 67000, meta: 50000 },
]

export function GraficoReceita() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Receita Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="receita" fill="var(--color-primary)" name="Receita" />
            <Bar dataKey="meta" fill="var(--color-muted)" name="Meta" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
