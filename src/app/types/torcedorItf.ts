import type { UF, ISODateString } from "./commons";
import type { AsaasCustomerCreate } from "./asaas";

export interface UsuarioItf {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  fotoUrl?: string;
  token?: string;
  status?: string;
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
