import { AdminItf } from "./adminItf";
import { ingressoItf } from "./ingressoItf";

export interface JogoItf {
    id: string;
    nome: string;
    data: string;
    local: string;
    descricao?: string;

    lotes: LoteItf[];
    ingressos: ingressoItf[];
    setores: JogoSetorItf[];

    criadoPorId?: string;
    atualizadoPorId?: string;
    criadoPor?: AdminItf;
    atualizadoPor?: AdminItf;

    criadoEm: string;
    atualizadoEm: string;
}

export interface LoteItf {
    id: string;
    nome?: string;
    tipo?: string;
    quantidade?: number;
    precoUnitario: string | number;
    inicioVendas?: string;
    fimVendas: string | null;
    limitePorCPF: number | null;
    jogoId?: string;
    jogoSetorId?: string;
    criadoEm?: string;
    atualizadoEm?: string;
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
    setor?: SetorItf;
    jogo?: JogoItf;
}

export interface SetorItf {
    id: string;
    slug: string;
    nome: string;
    capacidade: number;
    criadoEm: string;
    atualizadoEm: string;
}