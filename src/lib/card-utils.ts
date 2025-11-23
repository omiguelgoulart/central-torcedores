import type { CardBrand } from "../app/types/pagamentoItf"

// Detecta a bandeira do cartão baseado no número
export function detectCardBrand(cardNumber: string): CardBrand {
  const cleaned = cardNumber.replace(/\s/g, "")

  // Visa: começa com 4
  if (/^4/.test(cleaned)) return "visa"

  // Mastercard: 51-55 ou 2221-2720
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "mastercard"

  // Amex: 34 ou 37
  if (/^3[47]/.test(cleaned)) return "amex"

  // Elo: vários BINs
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(cleaned)) return "elo"

  // Hipercard: 38 ou 60
  if (/^(38|60)/.test(cleaned)) return "hipercard"

  // Discover: 6011, 622126-622925, 644-649, 65
  if (/^(6011|65|64[4-9]|622)/.test(cleaned)) return "discover" as CardBrand

  return "unknown"
}

// Retorna o nome da bandeira para exibição
export function getCardBrandName(brand: CardBrand): string {
  const names: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    elo: "Elo",
    amex: "American Express",
    hipercard: "Hipercard",
    discover: "Discover",
    unknown: "",
  }
  return names[brand] ?? ""
}
