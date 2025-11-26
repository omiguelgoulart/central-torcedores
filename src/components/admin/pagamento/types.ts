
export type PaymentStatus =  | "PENDENTE"  | "PAGO"  | "ATRASADO"  | "CANCELADO"  | "FALHA"  | "AGENDADO"

export type MetodoPagamentoApi = "PIX" | "BOLETO" | "CARTAO" | string

export type PaymentKind = "INGRESSO" | "PLANO" | "OUTRO"

export type PaymentRow = {
  id: string
  torcedorNome: string
  valor: number
  status: PaymentStatus
  metodo: MetodoPagamentoApi
  data: string
  referencia: string | null
  tipo: PaymentKind
  origemLabel?: string | null 
}