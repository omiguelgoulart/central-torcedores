import { JogoItf, LoteItf } from "./jogoItf";

export type StatusIngresso = "VALIDO" | "USADO" | "CANCELADO" | "EXPIRADO" | "ESTORNADO";

export interface ingressoItf {
  id: string;
  torcedorId: string | null;
  jogoId: string;
  loteId: string | null;
  qrCode: string;
  valor: string;
  status: StatusIngresso;
  criadoEm: string;
  usadoEm: string | null;
  atualizadoEm: string;
  pagamentoId: string | null;

  jogo: JogoItf | null;

  lote: LoteItf | null;
}
