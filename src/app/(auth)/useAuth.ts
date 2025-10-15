// stores/useAuth.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import Cookies from "js-cookie";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  token?: string; // opcional, dependendo de como o backend funciona
  status?: string;
};

type AuthState = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  token?: string;
  // Para acessar o token: useAuth.getState().usuario?.token
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      loading: false,

      login: async (email, senha) => {
        set({ loading: true });
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.message || "Erro ao fazer login");
            throw new Error(errorData.message || "Erro ao fazer login");
          } else {
            const data = await response.json();
            Cookies.set("auth", JSON.stringify(data), { secure: true, sameSite: "strict" });
            set({ usuario: data });
            toast.success("Login realizado com sucesso!");
          }
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : "Erro ao fazer login";
          toast.error(errorMessage);
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      fetchMe: async () => {
        try {
          const authCookie = Cookies.get("auth");
          if (authCookie) {
            set({ usuario: JSON.parse(authCookie) });
            return;
          }
          set({ usuario: null });
        } catch {
          set({ usuario: null });
        }
      },

      logout: async () => {
        set({ usuario: null });
        Cookies.remove("auth");
        toast("Você saiu da sua conta.");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ usuario: s.usuario }),
    }
  )
);
