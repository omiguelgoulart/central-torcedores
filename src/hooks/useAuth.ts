"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { removeAuthCookie, setAuthCookie } from "@/lib/storageToken";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  avatar?: string;
  token?: string;
  status?: string;
};

type AuthState = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  loginSilencioso: (email: string, senha: string) => Promise<boolean>;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  token?: string;
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
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
          });

          if (!response.ok) {
            const errorData: unknown = await response.json().catch(() => ({}));
            let msg = "Erro ao fazer login";
            if (typeof errorData === "object" && errorData !== null && "message" in errorData) {
              const maybeMessage = (errorData as { message?: unknown }).message;
              if (typeof maybeMessage === "string" && maybeMessage.trim()) {
                msg = maybeMessage;
              }
            }
            toast.error(msg);
            throw new Error(msg);
          }

          const rawUser = (await response.json()) as Usuario;
          const usuario: Usuario = rawUser;

          setAuthCookie(usuario);

          set({ usuario });
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : "Erro ao fazer login";
          console.error("Erro no login:", e);
          toast.error(errorMessage);
          throw e;
        } finally {
          set({ loading: false });
        }
      },
      loginSilencioso: async (email, senha) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
          });

          if (!response.ok) return false;

          const usuario = (await response.json()) as Usuario;

          setAuthCookie(usuario);

          set({ usuario });
          return true;
        } catch {
          return false;
        }
      },
      fetchMe: async () => {
        set({ loading: true });
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            credentials: "include",
          });

          if (!res.ok) {
            set({ usuario: null });
            return;
          }

          const usuario = (await res.json()) as Usuario;
          set({ usuario });
        } catch {
          set({ usuario: null });
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        set({ usuario: null });
        removeAuthCookie();
        toast.success("Você saiu da sua conta.");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ usuario: s.usuario }),
    }
  )
);
