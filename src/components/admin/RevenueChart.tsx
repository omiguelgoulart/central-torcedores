"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", revenue: 45000, target: 50000 },
  { month: "Fev", revenue: 52000, target: 50000 },
  { month: "Mar", revenue: 48000, target: 50000 },
  { month: "Abr", revenue: 61000, target: 50000 },
  { month: "Mai", revenue: 55000, target: 50000 },
  { month: "Jun", revenue: 67000, target: 50000 },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Receita Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="var(--color-primary)" name="Receita" />
            <Bar dataKey="target" fill="var(--color-muted)" name="Meta" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
