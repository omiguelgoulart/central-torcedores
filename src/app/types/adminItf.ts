import { JogoItf } from "./jogoItf";

export interface AdminItf {
    id: string;
    nome: string;
    email: string;
    senha: string;
    role?: AdminRole;
    ativo: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
    jogosCriados: JogoItf[];
    jogosAtualizados: JogoItf[];
}

export enum AdminRole {
    OPERACIONAL = "OPERACIONAL",
}
