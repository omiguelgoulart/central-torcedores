"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FieldError } from "react-hook-form"

interface FormFieldProps {
  id: string
  label: string
  type?: string
  placeholder: string
  register: import("react-hook-form").UseFormRegisterReturn
  error?: FieldError
}

export function FormField({ id, label, type = "text", placeholder, register, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register} />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}
