export type StatusTorcedor =  | "ATIVO"  | "INADIMPLENTE"  | "CANCELADO"  | "INATIVO";

export type TorcedorPerfilResponse = {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  dataNascimento: string | null;
  genero: string | null;
  fotoUrl: string | null;
  enderecoLogradouro: string | null;
  enderecoNumero: string | null;
  enderecoBairro: string | null;
  enderecoCidade: string | null;
  enderecoUF: string | null;
  enderecoCEP: string | null;
  statusSocio: StatusTorcedor | null;
  inadimplenteDesde: string | null;
  criadoEm: string | null;
  atualizadoEm: string | null;

  assinaturas: unknown[];
  pagamentos: unknown[];
  ingressos: unknown[];
  pedidos: unknown[];
};

export type AssinaturaApi = {
  id: string;
  status?: string | null;
  inicioEm?: string | null;
  proximaCobrancaEm?: string | null;
  planoNome?: string | null;
  plano?: {
    nome?: string | null;
  } | null;
};

export type PagamentoApi = {
  id: string;
  valor?: number | null;
  valorBruto?: number | null;
  status?: string | null;
  metodo?: string | null;
  billingType?: string | null;
  pagoEm?: string | null;
  criadoEm?: string | null;
};

export type IngressoApi = {
  id: string;
  status?: string | null;
  dataJogo?: string | null;
  jogoNome?: string | null;
  setorNome?: string | null;
  jogo?: {
    nome?: string | null;
    dataJogo?: string | null;
  } | null;
};

export type TorcedorUI = {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  cpf: string;
  telefone: string;
  status: StatusTorcedor;
  plano: string;
  dataCadastro: string | null;
  dataNascimento: string | null;
  endereco: string;
};

export type AssinaturaUI = {
  id: string;
  plano: string;
  status: string;
  inicio: string | null;
  proxima: string | null;
};

export type PagamentoUI = {
  id: string;
  valor: string;
  status: string;
  data: string | null;
  metodo: string;
};

export type IngressoUI = {
  id: string;
  jogo: string;
  data: string | null;
  setor: string;
  status: string;
};
