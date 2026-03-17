import type { UF, ISODateString } from "./commons";
import type { AsaasCustomerCreate } from "./asaas";

export interface UsuarioItf {
  id: string;
  matricula?: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cpf?: string | null;
  dataNascimento?: string | null;
  genero?: string | null;
  fotoUrl?: string | null;
  enderecoLogradouro?: string | null;
  enderecoNumero?: string | null;
  enderecoBairro?: string | null;
  enderecoCidade?: string | null;
  enderecoUF?: string | null;
  enderecoCEP?: string | null;
  status?: string;
  statusSocio?: string | null;
  inadimplenteDesde?: string | null;
  aceitaTermosEm?: string | null;
  aceitaMarketing?: boolean | null;
  aceitaMarketingEm?: string | null;
  origemCadastro?: string | null;
  documentoFrenteUrl?: string | null;
  documentoVersoUrl?: string | null;
  gatewayClienteId?: string | null;
  faceId?: string | null;
  emailVerificado?: boolean | null;
  criadoEm?: string | null;
  atualizadoEm?: string | null;
  assinaturas?: unknown[];
  pagamentos?: unknown[];
  ingressos?: unknown[];
  pedidos?: unknown[];
  token?: string;
};

export interface TermsConsent {
  accepted: boolean;
  policyVersion: string;
  timestamp: ISODateString;
}

export interface MarketingConsent {
  accepted: boolean;
  policyVersion: string;
  timestamp: ISODateString;
}

export interface Consents {
  termsAndPrivacy: TermsConsent;
  marketing: MarketingConsent;
}

export interface TorcedorCreateDTO {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string; 
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoUF: UF;
  enderecoCEP: string;
  consents: Consents;

  asaasCustomer?: AsaasCustomerCreate;
}

export interface TorcedorCreateResponse {
  id: string;
  email: string;
  nome: string;
  gatewayClienteId?: string | null;
}

export interface RegisterFormValues {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf: string;
  telefone: string;
  enderecoCEP: string;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoUF: UF;

  // LGPD
  aceitouTermosEPrivacidade: boolean;
  marketingOptIn: boolean;
}
