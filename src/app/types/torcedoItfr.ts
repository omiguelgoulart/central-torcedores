import { AssinaturaItf } from "./assinaturaItf";
import { ingressoItf } from "./ingressoItf";
import { PagamentoItf } from "./pagamentoItf";

export interface TorcedorITf {
  id: string;
  nome: string;
  email: string;
  matricula: string;
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
  statusSocio?: string | null;
  inadimplenteDesde?: string | null;
  aceitaTermosEm?: string | null;
  aceitaMarketing: boolean;
  aceitaMarketingEm?: string | null;
  origemCadastro?: string | null;
  documentoFrenteUrl?: string | null;
  documentoVersoUrl?: string | null;
  gatewayClienteId?: string | null;
  faceId?: string | null;
  emailVerificado: boolean;
  criadoEm: string;
  atualizadoEm: string;

  assinaturas?: AssinaturaItf[];

  ingressos?: ingressoItf[];

  pagamentosSocio?: PagamentoItf[];
  pagamentos?: PagamentoItf[];
}
