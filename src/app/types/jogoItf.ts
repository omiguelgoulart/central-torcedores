import { AdminItf } from "./adminItf";

export interface JogoItf {
    id: string;
    nome: string;
    data: string; // ISO date string
    local: string;
    descricao?: string;

    lotes: LoteItf[];
    ingressos: IngressoItf[];
    setores: JogoSetorItf[];

    criadoPorId?: string;
    atualizadoPorId?: string;
    criadoPor?: AdminItf;
    atualizadoPor?: AdminItf;

    criadoEm: string; // ISO date string
    atualizadoEm: string; // ISO date string
}

export interface LoteItf {
    id: string;
    nome: string;
    tipo: string;
    quantidade: number;
    precoUnitario: string;
    inicioVendas: string;
    fimVendas: string | null;
    limitePorCPF: number | null;
    jogoId: string;
    jogoSetorId: string;
    criadoEm: string;
    atualizadoEm: string;
}

export interface IngressoItf {
    id: string;
    torcedorId: string;
    jogoId: string;
    loteId: string;
    qrCode: string;
    valor: string;
    status: string;
    criadoEm: string;
    usadoEm: string | null;
    atualizadoEm: string;
    pagamentoId: string | null;
}

export interface JogoSetorItf {
    id: string;
    jogoId: string;
    setorId: string;
    capacidade: number;
    aberto: boolean;
    tipo: string;
    criadoEm: string;
    atualizadoEm: string;
    setor?:SetorItf;
    jogo?:JogoItf;
}

export interface SetorItf {
    id: string;
    slug: string;
    nome: string;
    capacidade: number;
    criadoEm: string; // ISO date string
    atualizadoEm: string; // ISO date string
}