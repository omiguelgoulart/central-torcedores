"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { ingressoItf } from "@/app/types/ingressoItf";
import { useAuth } from "./useAuth";

interface UseIngressoState {
  carregando: boolean;
  erro: string | null;
  ultimoIngresso: ingressoItf | null;
  ingressoAtual: ingressoItf | null;

  gerarIngresso: (params: {
    jogoId: string;
    loteId?: string | null;
  }) => Promise<ingressoItf | null>;

  buscarIngresso: (id: string) => Promise<ingressoItf | null>;
}

export const useIngresso = create<UseIngressoState>((set) => ({
  carregando: false,
  erro: null,
  ultimoIngresso: null,
  ingressoAtual: null,

  async gerarIngresso({ jogoId, loteId = null }) {
    // 🔴 AQUI ESTAVA O ERRO: antes estava tentando pegar `torcedor`
    const { usuario } = useAuth.getState();

    if (!usuario) {
      toast.error("Você precisa estar logado para gerar um ingresso.");
      return null;
    }

    try {
      set({ carregando: true, erro: null });

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ingressos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            jogoId,
            loteId,
            // 🔗 Aqui ligamos o ingresso ao torcedor (usuario.id)
            torcedorId: usuario.id, // se o backend já pegar do token, pode remover isso
          }),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Erro ao gerar ingresso");
      }

      set({ ultimoIngresso: data, carregando: false });
      return data;
    } catch (error) {
      console.error("Erro ao gerar ingresso:", error);
      set({ carregando: false, erro: (error as Error).message });
      toast.error((error as Error).message || "Erro ao gerar ingresso");
      return null;
    }
  },

  async buscarIngresso(id: string) {
    try {
      set({ carregando: true, erro: null });

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ingressos/${id}`,
        {
          credentials: "include",
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Ingresso não encontrado");
      }

      set({ ingressoAtual: data, carregando: false });
      return data;
    } catch (error) {
      console.error("Erro ao buscar ingresso:", error);
      set({ carregando: false, erro: (error as Error).message });
      toast.error((error as Error).message || "Erro ao buscar ingresso");
      return null;
    }
  },
}));
