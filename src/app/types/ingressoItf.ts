export type StatusIngresso = "VALIDO" | "USADO" | "CANCELADO";

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

  jogo: {
    id: string;
    nome: string;
    dataHora: string;     
    estadio: string;
  };

  lote: {
    id: string;
    nome: string;
    setor: string;
    descricao?: string | null;
  } | null;
}
