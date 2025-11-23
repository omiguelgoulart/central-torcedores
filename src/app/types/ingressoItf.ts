export type StatusIngresso = "VALIDO" | "USADO" | "CANCELADO";

export interface ingressoItf {
  id: string;
  torcedorId: string | null;
  jogoId: string;
  loteId: string | null;
  qrCode: string;          // dataURL, url da imagem ou base64
  valor: string;           // Decimal serializado
  status: StatusIngresso;
  criadoEm: string;
  usadoEm: string | null;
  atualizadoEm: string;
  pagamentoId: string | null;

  // Campos relacionais opcionais (quando tua API devolver expandido)
  jogo?: {
    id: string;
    mandante?: string;
    visitante?: string;
    dataHora?: string;
    estadio?: string;
  } | null;

  lote?: {
    id: string;
    nome?: string;
    setor?: string;
    descricao?: string | null;
  } | null;
}
