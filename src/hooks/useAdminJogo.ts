"use client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export type JogoPayload = {
  nome: string;
  data: string;
  local?: string;
  descricao?: string;
};

export function useAdminJogo() {
  async function fetchJogos<T = unknown>(): Promise<T> {
    const res = await fetch(`${API}/jogo`);
    if (!res.ok) throw new Error("Erro ao carregar jogos");
    return res.json() as T;
  }

  async function fetchJogoById<T = unknown>(id: string): Promise<T> {
    const res = await fetch(`${API}/jogo/${id}`);
    if (!res.ok) throw new Error("Erro ao carregar jogo");
    return res.json() as T;
  }

  async function createJogo(payload: JogoPayload): Promise<{ jogoId: string; message: string }> {
    const res = await fetch(`${API}/jogo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao criar jogo");
    return res.json();
  }

  async function updateJogo(id: string, payload: Partial<JogoPayload>): Promise<void> {
    const res = await fetch(`${API}/jogo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao atualizar jogo");
  }

  async function deleteJogo(id: string): Promise<void> {
    const res = await fetch(`${API}/jogo/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao deletar jogo");
  }

  return { fetchJogos, fetchJogoById, createJogo, updateJogo, deleteJogo };
}
