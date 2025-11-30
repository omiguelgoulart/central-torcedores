
export type PeriodicidadePlano = "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL";

export type StatusAssinaturaApi = "ATIVA" | "CANCELADA" | "SUSPENSA" | "EXPIRADA";

export type StatusFaturaApi = "ABERTA" | "PAGA" | "ATRASADA" | "CANCELADA";

export interface ApiFatura {
  id: string;
  competencia: string;
  valor: number | string;
  status: StatusFaturaApi;
  vencimentoEm: string;
}

export interface ApiPlano {
  id: string;
  nome: string;
  descricao?: string | null;
  valor?: number | string | null;
  periodicidade?: PeriodicidadePlano | null;
}

export interface ApiAssinatura {
  id: string;
  status: StatusAssinaturaApi;
  inicioEm?: string | null;
  proximaCobrancaEm?: string | null;
  valorAtual?: number | string | null;
  periodicidade?: PeriodicidadePlano | null;
  plano?: ApiPlano | null;
  faturas?: ApiFatura[];
}

export interface UsuarioResponse {
  id: string;
  nome: string;
  matricula: string;
  numeroCartao?: string | null;
  assinaturas?: ApiAssinatura[];
}

export type StatusAssociacaoUI = "ATIVA" | "PENDENTE" | "CANCELADA" | "SEM_PLANO";

export interface AssociacaoData {
  planoId: string | null;
  planoNome: string | null;
  descricao?: string | null;
  status: StatusAssociacaoUI;
  valor: number | null;
  periodicidade: PeriodicidadePlano | null;
  dataInicio?: string | null;
  proximaCobranca?: string | null;
  matricula: string;
  numeroCartao?: string | null;
  nomeSocio: string;
}
