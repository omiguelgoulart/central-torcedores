import { IBeneficio } from "./beneficioItf";

export type Periodicidade = 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export interface IPlano {
    id: string;
    nome: string;
    descricao: string | null;
    valor: number;
    periodicidade: Periodicidade;
    isFeatured: boolean;
    badgeLabel: string | null;
    ordem: number;
    beneficios: IBeneficio[];
    criadoEm: Date;
    atualizadoEm: Date;
}
