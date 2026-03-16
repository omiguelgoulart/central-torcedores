"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { IPlano } from "@/app/types/planoItf";

type PlanoState = {
    planos: IPlano[] | null;
    loading: boolean;
    error: string | null;
    fetchPlanos: () => Promise<void>;
    createPlano: (planoData: Omit<IPlano, "id" | "criadoEm" | "atualizadoEm">) => Promise<void>;
};

const usePlano = create<PlanoState>((set) => ({
    planos: null,
    loading: false,
    error: null,
    fetchPlanos: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/planos`, {
                cache: "no-store",
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar planos");
            }
            const payload = (await response.json()) as unknown;

            const dataObj =
                typeof payload === "object" && payload !== null
                    ? (payload as { planos?: unknown; data?: unknown; items?: unknown })
                    : undefined;

            const data = Array.isArray(payload)
                ? payload
                : Array.isArray(dataObj?.planos)
                    ? dataObj.planos
                    : Array.isArray(dataObj?.data)
                        ? dataObj.data
                        : Array.isArray(dataObj?.items)
                            ? dataObj.items
                            : [];

            set({ planos: data });
        } catch (err) {
            console.error("Erro ao carregar planos:", err);
            set({ error: "Erro ao carregar planos" });
            toast.error("Erro ao carregar planos");
        } finally {
            set({ loading: false });
        }
    },

    createPlano: async (planoData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/planos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(planoData),
            });
            if (!response.ok) {
                const errorData: unknown = await response.json().catch(() => ({}));
                let msg = "Erro ao criar plano";
                if (typeof errorData === "object" && errorData !== null && "message" in errorData) {
                    const maybeMessage = (errorData as { message?: unknown }).message;
                    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
                        msg = maybeMessage;
                    }
                }
                throw new Error(msg);
            }
            toast.success("Plano criado com sucesso!");
            await usePlano.getState().fetchPlanos();
        } catch (err) {
            console.error("Erro ao criar plano:", err);
            const errorMessage = err instanceof Error ? err.message : "Erro ao criar plano";
            toast.error(errorMessage);
        }
    },
}));

export default usePlano;