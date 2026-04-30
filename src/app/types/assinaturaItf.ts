import type { Periodicidade } from "./planoItf";

export enum StatusAssinatura {
  ATIVA = 'ATIVA',
  CANCELADA = 'CANCELADA',
  SUSPENSA = 'SUSPENSA',
  EXPIRADA = 'EXPIRADA',
}

export interface AssinaturaItf {
  id: string;
  torcedorId: string;
  planoId: string;
  status: StatusAssinatura;
  inicioEm: Date;
  expiraEm?: Date;
  proximaCobrancaEm?: Date;
  canceladaEm?: Date;
  motivoCancelamento?: string;
  suspensaEm?: Date;
  retomadaEm?: Date;
  periodicidade: Periodicidade;
  valorAtual?: number;
  moeda?: string;
  gatewayClienteId?: string;
  gatewayAssinaturaId?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export type ApiFatura = {
  id: string;
  competencia: string;
  vencimentoEm: string;
  valor: number | string;
  status: string;
  referencia?: string | null;
};

export type ApiAssinatura = {
  id: string;
  status: string;
  inicioEm: string | null;
  proximaCobrancaEm: string | null;
  periodicidade: Periodicidade | null;
  valorAtual: number | string | null;
  plano?: {
    id: string;
    nome: string;
    descricao?: string | null;
    valor?: number | string | null;
    periodicidade?: Periodicidade | null;
  } | null;
  faturas?: ApiFatura[];
};

export type UsuarioResponse = {
  nome: string;
  matricula: string;
  numeroCartao?: string | null;
  fotoUrl?: string | null;
  assinaturas?: ApiAssinatura[];
};

export type AssociacaoData = {
  planoId: string | null;
  planoNome: string | null;
  descricao: string | null;
  status: "ATIVA" | "PENDENTE" | "CANCELADA" | "SEM_PLANO";
  valor: number | null;
  periodicidade: Periodicidade | null;
  dataInicio: string | null;
  proximaCobranca: string | null;
  matricula: string;
  numeroCartao: string | null;
  nomeSocio: string;
  fotoUrl: string | null;
};