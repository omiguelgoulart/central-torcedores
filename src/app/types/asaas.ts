// Modelos enxutos alinhados ao Asaas (lado cliente)
// Use estes DTOs no backend também, se quiser isomorfismo.

export interface AsaasCustomerCreate {
  name: string;         // nome completo
  email: string;
  cpfCnpj: string;      // 11 ou 14 dígitos
  phone?: string;       // DDD + número (10/11 dígitos)
  postalCode?: string;  // CEP sem máscara
  address?: string;     // logradouro
  addressNumber?: string;
  province?: string;    // bairro
  city?: string;
  state?: string;       // UF
}

export interface AsaasCustomer {
  id: string;           // gatewayClienteId no seu modelo
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
}
