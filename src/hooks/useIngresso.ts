"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { ingressoItf } from "@/app/types/ingressoItf";
import { useAuth } from "./useAuth";

export type TorcedorResumo = {
  id: string;
  nome: string;
  email: string;
  cpf?: string | null;
};

interface UseIngressoState {
  carregando: boolean;
  erro: string | null;
  ultimoIngresso: ingressoItf | null;
  ingressoAtual: ingressoItf | null;
  torcedorAtual: TorcedorResumo | null;

  gerarIngresso: (params: {
    jogoId: string;
    loteId?: string | null;
  }) => Promise<ingressoItf | null>;

  buscarIngresso: (id: string, token?: string) => Promise<ingressoItf | null>;

  buscarTorcedorByCpf: (cpf: string) => Promise<TorcedorResumo | null>;

  criarIngressoComPagamento: (params: {
    loteId: string;
    pagamentoId?: string;
  }) => Promise<{ ingressoId: string; pedidoId: string; qrCode: string } | null>;

  resetarErro: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

function normalizarIngressoPayload(payload: unknown): ingressoItf {
  const data = payload as {
    id?: string;
    torcedorId?: string | null;
    jogoId?: string;
    loteId?: string | null;
    qrCode?: string;
    valor?: string | number;
    status?: ingressoItf["status"];
    criadoEm?: string;
    usadoEm?: string | null;
    atualizadoEm?: string;
    pagamentoId?: string | null;
    jogo?: ingressoItf["jogo"];
    lote?: ingressoItf["lote"];
    itemPedido?: {
      loteId?: string;
      valorUnitario?: string | number;
      lote?: ingressoItf["lote"] & { jogo?: ingressoItf["jogo"] };
      pedido?: { torcedorId?: string; pagamento?: { externalId?: string } };
    };
  };

  const itemPedido = data.itemPedido;
  const lote = data.lote ?? itemPedido?.lote ?? null;
  const jogo = data.jogo ?? itemPedido?.lote?.jogo ?? null;

  return {
    id: data.id ?? "",
    torcedorId: data.torcedorId ?? itemPedido?.pedido?.torcedorId ?? null,
    jogoId: data.jogoId ?? (jogo?.id ?? ""),
    loteId: data.loteId ?? itemPedido?.loteId ?? lote?.id ?? null,
    qrCode: data.qrCode ?? "",
    valor: String(data.valor ?? itemPedido?.valorUnitario ?? "0"),
    status: data.status ?? "VALIDO",
    criadoEm: data.criadoEm ?? new Date().toISOString(),
    usadoEm: data.usadoEm ?? null,
    atualizadoEm: data.atualizadoEm ?? new Date().toISOString(),
    pagamentoId: data.pagamentoId ?? itemPedido?.pedido?.pagamento?.externalId ?? null,
    jogo,
    lote,
  };
}

export const useIngresso = create<UseIngressoState>((set) => ({
  carregando: false,
  erro: null,
  ultimoIngresso: null,
  ingressoAtual: null,
  torcedorAtual: null,

  resetarErro: () => set({ erro: null }),

  async gerarIngresso({ jogoId, loteId = null }) {
    const { torcedor } = useAuth.getState();

    if (!torcedor) {
      toast.error("Você precisa estar logado para gerar um ingresso.");
      return null;
    }

    try {
      set({ carregando: true, erro: null });

      const resp = await fetch(`${API}/ingresso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          jogoId,
          loteId,
          torcedorId: torcedor.id,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Erro ao gerar ingresso");
      }

      set({ ultimoIngresso: data, carregando: false });
      return data;
    } catch (error) {
      const msg = (error as Error).message || "Erro ao gerar ingresso";
      console.error("Erro ao gerar ingresso:", error);
      set({ carregando: false, erro: msg });
      toast.error(msg);
      return null;
    }
  },

  async buscarIngresso(id: string, token?: string) {
    try {
      set({ carregando: true, erro: null });

      const resp = await fetch(`${API}/ingresso/${id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await resp.json();

      if (!resp.ok) {
        if (resp.status === 404) {
          throw new Error("Ingresso não encontrado");
        }
        throw new Error(data.error || data.message || "Erro ao buscar ingresso");
      }

      const ingressoNormalizado = normalizarIngressoPayload(data);
      set({ ingressoAtual: ingressoNormalizado, carregando: false });
      return ingressoNormalizado;
    } catch (error) {
      const msg = (error as Error).message || "Erro ao buscar ingresso";
      console.error("Erro ao buscar ingresso:", error);
      set({ carregando: false, erro: msg });
      toast.error(msg);
      return null;
    }
  },

  async buscarTorcedorByCpf(cpf: string) {
    const { token } = useAuth.getState();

    try {
      set({ carregando: true, erro: null });

      const cpfLimpo = cpf.replace(/\D/g, "");

      if (!cpfLimpo) {
        throw new Error("Informe um CPF válido.");
      }

      const resp = await fetch(`${API}/usuario/cpf/${cpfLimpo}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(
          data.error || data.message || "Torcedor não encontrado."
        );
      }

      set({ torcedorAtual: data, carregando: false });
      return data;
    } catch (error) {
      const msg = (error as Error).message || "Erro ao buscar torcedor.";
      console.error("Erro ao buscar torcedor:", error);
      set({ carregando: false, erro: msg });
      return null;
    }
  },

  async criarIngressoComPagamento(params) {
    const { token } = useAuth.getState();

    try {
      set({ carregando: true, erro: null });

      const payload = {
        loteId: params.loteId,
        ...(params.pagamentoId ? { pagamentoId: params.pagamentoId } : {}),
      };

      const resp = await fetch(`${API}/ingresso/pagamento/criar`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (resp.status === 409) {
        throw new Error("Este pagamento já possui um ingresso gerado.");
      }

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || data.message || "Erro ao gerar ingresso.");
      }

      const ingressoId = data?.ingressoId ?? data?.ingresso?.id;

      if (!ingressoId) {
        throw new Error("Ingresso criado mas sem ID retornado.");
      }

      set({ carregando: false });
      toast.success("Ingresso criado com sucesso!");
      return {
        ingressoId,
        pedidoId: data?.pedidoId,
        qrCode: data?.qrCode
      };
    } catch (error) {
      const msg = (error as Error).message || "Erro ao criar ingresso.";
      console.error("Erro ao criar ingresso:", error);
      set({ carregando: false, erro: msg });
      toast.error(msg);
      return null;
    }
  },
}));
