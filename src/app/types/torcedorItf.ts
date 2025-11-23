import type { UF, ISODateString } from "./commons";
import type { AsaasCustomerCreate } from "./asaas";

// LGPD – estrutura de consentimentos enviada no cadastro
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

// Payload mínimo para criar Torcedor (cadastro)
export interface TorcedorCreateDTO {
  nome: string;
  email: string;
  senha: string; // em trânsito; no backend virar hash
  telefone: string;
  cpf: string; // 11 dígitos
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoUF: UF;
  enderecoCEP: string;
  consents: Consents;

  // opcional: já enviar bloco para criação do cliente no Asaas
  asaasCustomer?: AsaasCustomerCreate;
}

// Resposta comum após criar Torcedor
export interface TorcedorCreateResponse {
  id: string;
  email: string;
  nome: string;
  gatewayClienteId?: string | null;
}

// Tipos usados pelo React Hook Form neste cadastro
export interface RegisterFormValues {
  // conta/acesso
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;

  // identificação/endereço (Asaas)
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
