"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import Cookies from "js-cookie";

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

          // Dados básicos do usuário vindos do backend
          const rawUser = (await response.json()) as Usuario;
          const usuario: Usuario = rawUser;

          // Atualiza cookies
          Cookies.set("auth", JSON.stringify(usuario), {
            secure: true,
            sameSite: "strict",
          });

          // Atualiza estado
          set({ usuario });
          toast.success("Login realizado com sucesso!");
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : "Erro ao fazer login";
          console.error("Erro no login:", e);
          toast.error(errorMessage);
          throw e;
        } finally {
          set({ loading: false });
        }
      },
      fetchMe: async () => {
        set({ loading: true });
        try {
          const authCookie = Cookies.get("auth");
          if (!authCookie) {
            set({ usuario: null });
            return;
          }

          let usuario: Usuario;
          try {
            usuario = JSON.parse(authCookie) as Usuario;
          } catch (err) {
            console.error("auth cookie inválido:", err);
            Cookies.remove("auth");
            set({ usuario: null });
            return;
          }

          set({ usuario });
        } catch (e) {
          console.error("Erro no fetchMe:", e);
          set({ usuario: null });
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        set({ usuario: null });
        Cookies.remove("auth");
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
