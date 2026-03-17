"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { removeAuthCookie, setAuthCookie } from "@/lib/storageToken";
import { UsuarioItf } from "@/app/types/torcedorItf";

type Usuario = UsuarioItf;



type AuthState = {
  usuario: UsuarioItf | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe?: () => Promise<void>;
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
          if (usuario.token) {
            setAuthCookie({ token: usuario.token });
          }

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
     
      logout: async () => {
        set({ usuario: null });
        removeAuthCookie();
        toast.success("Você saiu da sua conta.");
      },
      fetchMe: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/me`, {
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Erro ao buscar dados do usuário");
          }

          const rawUser = (await response.json()) as Usuario;
          const usuario: Usuario = rawUser;
          set({ usuario });
        } catch (e) {
          console.error("Erro ao buscar dados do usuário:", e);
          toast.error("Erro ao buscar dados do usuário");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s: AuthState) => ({ usuario: s.usuario }),
    }
  )
);
