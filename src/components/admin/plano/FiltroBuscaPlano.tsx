"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type FiltroBuscaProps = {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export function FiltroBusca({ id, label, placeholder, value, onChange }: FiltroBuscaProps) {
  return (
    <div className="flex-1">
      <Label htmlFor={id} className="text-xs mb-1 block">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
