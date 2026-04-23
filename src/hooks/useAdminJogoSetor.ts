"use client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export type SetorDisponivel = {
  id: string;
  nome: string;
  slug: string;
  tipo: string;
};

export type JogoSetorPayload = {
  jogoId: string;
  setorId: string;
  capacidade: number;
  aberto: boolean;
  tipo: string;
};

export function useAdminJogoSetor() {
  async function fetchSetores(): Promise<SetorDisponivel[]> {
    const res = await fetch(`${API}/setor`);
    if (!res.ok) throw new Error("Erro ao carregar setores");
    return res.json();
  }

  async function createJogoSetor<T = unknown>(payload: JogoSetorPayload): Promise<T> {
    const res = await fetch(`${API}/jogo-setor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao criar setor do jogo");
    return res.json() as T;
  }

  async function updateJogoSetor<T = unknown>(
    id: string,
    payload: Partial<Pick<JogoSetorPayload, "capacidade" | "aberto" | "tipo">>
  ): Promise<T> {
    const res = await fetch(`${API}/jogo-setor/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao atualizar setor do jogo");
    return res.json() as T;
  }

  async function deleteJogoSetor(id: string): Promise<void> {
    const res = await fetch(`${API}/jogo-setor/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao remover setor do jogo");
  }

  return { fetchSetores, createJogoSetor, updateJogoSetor, deleteJogoSetor };
}
