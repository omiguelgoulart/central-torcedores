// app/hooks/useAuth.ts
"use client";

import Cookies from "js-cookie";
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // 👈 pega do .env.local

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // ações
  setToken: (token: string | null) => void;
  clearToken: () => void;
  logout: () => void;
  login: (email: string, senha: string) => Promise<void>;
  cadastro: (nome: string,email: string, senha: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  token: Cookies.get("token") || null,
  isLoading: false,
  error: null,

  // salva ou remove o token
  setToken: (token) => {
    if (token) {
      Cookies.set("token", token, { expires: 7, secure: true, sameSite: "lax" });
    } else {
      Cookies.remove("token");
    }
    set({ token });
  },

  // remove token do cookie
  clearToken: () => {
    Cookies.remove("token");
    set({ token: null });
  },

  // logout e redireciona
  logout: () => {
    Cookies.remove("token");
    set({ token: null });
    window.location.href = "/login";
  },

  // login real com chamada à API
  login: async (email: string, senha: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erro ao fazer login");
      }

      const data = await response.json();
      const token = data?.token;

      if (!token) throw new Error("Token não recebido da API");

      Cookies.set("token", token, { expires: 7, secure: true, sameSite: "lax" });
      set({ token });
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      let errorMessage = "Falha no login";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      console.error("Erro no login:", error);
    } finally {
      set({ isLoading: false });
    }
  },
    cadastro: async (nome: string, email: string, senha: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/auth/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
        if (!response.ok) { 
        const err = await response.json();
        throw new Error(err.message || "Erro ao cadastrar");
      }
        const data = await response.json(); 
        const token = data?.token;
        if (!token) throw new Error("Token não recebido da API");

        Cookies.set("token", token, { expires: 7, secure: true, sameSite: "lax" });
        set({ token });
        window.location.href = "/dashboard";
    }
    catch (error: unknown) {
      let errorMessage = "Falha no cadastro";
        if (error instanceof Error) {
        errorMessage = error.message;
      }
        set({ error: errorMessage });
        console.error("Erro no cadastro:", error);
    } finally {
      set({ isLoading: false });
    }},
}));
