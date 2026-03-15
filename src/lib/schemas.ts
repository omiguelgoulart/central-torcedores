import { z } from "zod";

export const JogoAPISchema = z.object({
    id: z.string(),
    nome: z.string(),
    data: z.string(),
    local: z.string(),
    descricao: z.string().nullable(),
    hasLotes: z.boolean().optional(),
});

export const PlanoAPISchema = z.object({
    id: z.string(),
    nome: z.string(),
    descricao: z.string().nullable(),
    valor: z.string(),
    periodicidade: z.string(),
    isFeatured: z.boolean().nullable(),
    badgeLabel: z.string().nullable(),
    beneficios: z.array(
        z.object({
            id: z.string(),
            titulo: z.string(),
            descricao: z.string().nullable(),
        }),
    ),
});
