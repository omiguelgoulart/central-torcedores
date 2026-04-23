"use client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export type LotePayload = {
  nome: string;
  tipo: "INTEIRA" | "MEIA" | "CORTESIA" | "PROMO";
  quantidade: number;
  precoUnitario: number;
  inicioVendas?: string;
  fimVendas?: string;
  limitePorCPF?: number;
  jogoId: string;
  jogoSetorId: string;
};

export function useAdminLote() {
  async function fetchLoteById<T = unknown>(id: string): Promise<T> {
    const res = await fetch(`${API}/lote/${id}`);
    if (!res.ok) throw new Error("Erro ao carregar lote");
    return res.json() as T;
  }

  async function createLote(payload: LotePayload): Promise<{ loteId: string; message: string }> {
    const res = await fetch(`${API}/lote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao criar lote");
    return res.json();
  }

  async function updateLote(id: string, payload: Partial<LotePayload>): Promise<void> {
    const res = await fetch(`${API}/lote/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao atualizar lote");
  }

  async function deleteLote(id: string): Promise<void> {
    const res = await fetch(`${API}/lote/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao deletar lote");
  }

  return { fetchLoteById, createLote, updateLote, deleteLote };
}
