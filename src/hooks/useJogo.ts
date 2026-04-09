"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { JogoItf } from "@/app/types/jogoItf";

type JogoState = {
    jogos: JogoItf[] | null;
    loading: boolean;
    error: string | null;
    fetchJogos: () => Promise<void>;
    fetchJogosById: (id: string) => Promise<JogoItf | null>;
};

const useJogo = create<JogoState>((set) => ({
    jogos: null,
    loading: false,
    error: null,
    fetchJogos: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogo`, {
                cache: "no-store",
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar jogos");
            }
            const payload = (await response.json()) as unknown;

            const dataObj =
                typeof payload === "object" && payload !== null
                    ? (payload as { jogos?: unknown; data?: unknown; items?: unknown })
                    : undefined;

            const data = Array.isArray(payload)
                ? payload
                : Array.isArray(dataObj?.jogos)
                    ? dataObj.jogos
                    : Array.isArray(dataObj?.data)
                        ? dataObj.data
                        : Array.isArray(dataObj?.items)
                            ? dataObj.items
                            : [];

            set({ jogos: data });
        } catch (err) {
            console.error("Erro ao carregar jogos:", err);
            set({ error: "Erro ao carregar jogos" });
            toast.error("Erro ao carregar jogos");
        } finally {
            set({ loading: false });
        }
    },

    fetchJogosById: async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogo/${encodeURIComponent(id)}`, {
                cache: "no-store",
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar jogo por ID");
            }
            const jogo = (await response.json()) as JogoItf;
            return jogo;
        } catch (err) {
            console.error(`Erro ao carregar jogo com ID ${id}:`, err);
            toast.error("Erro ao carregar detalhes do jogo");
            return null;
        }    
    },
    
}));

export default useJogo;