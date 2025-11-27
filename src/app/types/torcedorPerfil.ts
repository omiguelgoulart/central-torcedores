import { ingressoItf } from "./ingressoItf";

export interface TorcedorPerfil {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  statusSocio?: string | null;
  gatewayClienteId?: string | null;

  assinaturas: {
    id: string;
    status: string;
    inicioEm: string;
    proximaCobrancaEm?: string | null;
    // se você expuser mais campos da assinatura na API, pode adicionar aqui
    plano: {
      nome: string;
      descricao?: string | null;
      valor: string;          // Decimal serializado
      periodicidade: string;
    };
    faturas: {
      id: string;
      status: string;
      vencimentoEm: string;   // Date em ISO string
      valor: string;          // Decimal serializado
    }[];
  }[];

  ingressos: ingressoItf[];

  pagamentos: {
    id: string;
    status: string;
    valor: string;            // Decimal serializado
    dataVencimento: string;   // casa com campo `dataVencimento` do modelo
    pagoEm?: string | null;   // opcional (pode ser null)
    metodo: string;           // corresponde a `metodo` / `metodoPagamento`
  }[];
}
