"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type OpcaoStatus = {
  value: string
  label: string
}

type FiltroStatusSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: OpcaoStatus[]
}

export function FiltroStatusSelect({
  label,
  value,
  onChange,
  options,
}: FiltroStatusSelectProps) {
  return (
    <div className="w-full md:w-40">
      <Label className="text-xs mb-1 block">{label}</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione..." />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
