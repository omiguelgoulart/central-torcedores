export interface IBeneficio {
    id: string;
    slug: string;
    titulo: string;
    descricao: string | null;
    icone: string | null;
    ativo: boolean;
    planoId: string;
    ordem: number;
    destaque: boolean;
    observacao: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
}
