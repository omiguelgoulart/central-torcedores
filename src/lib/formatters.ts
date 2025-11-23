export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  const chunks = cleaned.match(/.{1,4}/g) || []
  return chunks.join(" ").substring(0, 19) // Max 16 digits + 3 spaces
}

export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
  }
  return cleaned
}

export function formatCVV(value: string): string {
  return value.replace(/\D/g, "").substring(0, 4)
}

export function formatCPFCNPJ(value: string): string {
  const cleaned = value.replace(/\D/g, "")

  if (cleaned.length <= 11) {
    // CPF: 000.000.000-00
    return cleaned
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  } else {
    // CNPJ: 00.000.000/0000-00
    return cleaned
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }
}

export function formatPostalCode(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  return cleaned.replace(/(\d{5})(\d{1,3})/, "$1-$2").substring(0, 9)
}

export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, "")

  if (cleaned.length <= 10) {
    // (00) 0000-0000
    return cleaned.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2")
  } else {
    // (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2")
  }
}
