// app/types/pagamentoItf.ts

export type PaymentStatus =
  | "PAID"
  | "APPROVED"
  | "DECLINED"
  | "EXPIRED"
  | "ERROR"
  | "PENDING";

export interface ResumoPedido {
  description: string;
  subtotal: number;
  fees: number;
  total: number;
}

export type CardBrand =
  | "visa"
  | "mastercard"
  | "elo"
  | "amex"
  | "hipercard"
  | "unknown";

export type CardType = "credit" | "debit";

export interface CardPaymentData {
  cardType: CardType;
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  phone: string;
}

export interface PixQrData {
  encodedImage?: string;
  payload?: string;
  expiresAt?: string;
}

export interface BoletoLinks {
  bankSlipUrl?: string;
  invoiceUrl?: string;
  dueDate?: string;
}

export interface PagamentoResponse {
  id: string;
  status: string;
  raw?: unknown;
}
