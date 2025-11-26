"use client"

import { Card, CardContent } from "@/components/ui/card"

type AdminResumoCardProps = {
  total: number
  loading: boolean
}

export function AdminResumoCard({ total, loading }: AdminResumoCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            Total de Administradores
          </p>
          <p className="text-2xl font-bold">
            {loading ? "—" : total}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
