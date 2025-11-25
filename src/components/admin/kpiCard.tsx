import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CartaoKPIProps {
  titulo: string
  valor: string
  icone: LucideIcon
  tendencia?: "alta" | "baixa"
  valorTendencia?: string
}

export function CartaoKPI({ titulo, valor, icone: Icone, tendencia, valorTendencia }: CartaoKPIProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{titulo}</p>
            <h3 className="text-2xl font-bold">{valor}</h3>
            {valorTendencia && (
              <p className={cn("text-xs mt-2", tendencia === "alta" ? "text-green-600" : "text-red-600")}>
                {valorTendencia} vs mês anterior
              </p>
            )}
          </div>
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <Icone className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
