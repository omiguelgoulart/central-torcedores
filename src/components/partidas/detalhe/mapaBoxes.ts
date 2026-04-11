export type BoxMapa = {
    left: number;
    top: number;
    width: number;
    height: number;
};

const BOXES_POR_NOME: Array<[string, BoxMapa]> = [
    ["jk", { left: 18, top: 17, width: 60, height: 12 }],
    ["social", { left: 18, top: 72, width: 60, height: 10 }],
    ["cativas", { left: 60.5, top: 82, width: 18, height: 8 }],
    ["norte", { left: 12, top: 30, width: 10, height: 45 }],
    ["norte visitante", { left: 12, top: 30, width: 10, height: 45 }],
    ["norte-visitante", { left: 12, top: 30, width: 10, height: 45 }],
    ["sul", { left: 75, top: 32, width: 10, height: 45 }],
];

const BOXES_PADRAO: BoxMapa[] = [
    { left: 18, top: 17, width: 60, height: 12 },
    { left: 18, top: 40, width: 60, height: 12 },
    { left: 18, top: 63, width: 60, height: 12 },
    { left: 18, top: 82, width: 60, height: 10 },
    { left: 12, top: 30, width: 10, height: 45 },
    { left: 75, top: 30, width: 10, height: 45 },
];

function normalizarTexto(texto: string) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

export function getBoxMapa(
    nome: string,
    index: number,
    total: number,
    box?: BoxMapa,
): BoxMapa {
    if (box && box.width > 0 && box.height > 0) {
        return box;
    }

    const nomeNormalizado = normalizarTexto(nome);
    const boxPorNome = BOXES_POR_NOME.find(
        ([nomeCadastrado]) => nomeCadastrado === nomeNormalizado,
    )?.[1];

    if (boxPorNome) {
        return boxPorNome;
    }

    if (total <= 1) {
        return { left: 20, top: 20, width: 60, height: 45 };
    }

    if (total <= BOXES_PADRAO.length) {
        for (const [position, boxPadrao] of BOXES_PADRAO.entries()) {
            if (position === index) {
                return boxPadrao;
            }
        }

        return BOXES_PADRAO[BOXES_PADRAO.length - 1];
    }

    const colunas = 3;
    const largura = 18;
    const altura = 14;
    const espacamentoX = 4;
    const espacamentoY = 6;
    const linha = Math.floor(index / colunas);
    const coluna = index % colunas;

    return {
        left: 10 + coluna * (largura + espacamentoX),
        top: 16 + linha * (altura + espacamentoY),
        width: largura,
        height: altura,
    };
}