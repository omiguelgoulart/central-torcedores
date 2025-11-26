"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AdminFiltroBuscaProps = {
  value: string
  onChange: (value: string) => void
  errorMessage?: string | null
}

export function AdminFiltroBusca({
  value,
  onChange,
  errorMessage,
}: AdminFiltroBuscaProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-2">
        {errorMessage && (
          <p className="text-xs text-amber-500">
            {errorMessage}
          </p>
        )}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="text-xs mb-1 block">
              Buscar
            </Label>
            <Input
              id="search"
              placeholder="Nome, email..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
