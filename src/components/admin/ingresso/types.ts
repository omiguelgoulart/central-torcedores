export type StatusPedido =
  | "RASCUNHO"
  | "RESERVA_ATIVA"
  | "PENDENTE_PAGAMENTO"
  | "PAGO"

export interface JogoListaItem {
  id: string
  nome: string
  data: string
  hora: string
  totalPedidos: number
  reservasAtivas: number
  pendentesPagamento: number
  valorTotal: number
  totalCheckins: number
  taxaCheckin: number // 0–100
}

export interface PedidoJogo {
  id: string
  torcedor: string
  setor: string
  status: StatusPedido
  quantidade: number
  total: number
  expiraEm: string | null
}

export interface ResumoCheckinJogo {
  totalCheckins: number
  taxaCheckin: number
  portoesAtivos: number
}
