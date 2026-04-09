"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { getToken, removeAuthCookie, setAuthCookie } from "@/lib/storageToken";
import { TorcedorITf } from "@/app/types/torcedoItfr";

type AuthState = {
  torcedor: TorcedorITf | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  loginSilencioso: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  token?: string;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      torcedor: null,
      loading: false,
      token: getToken(),

      login: async (email, senha) => {
        set({ loading: true });

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              credentials: "include",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, senha }),
            }
          );

          if (!response.ok) {
            const errorData: unknown = await response.json().catch(() => ({}));
            let msg = "Erro ao fazer login";

            if (
              typeof errorData === "object" &&
              errorData !== null &&
              "message" in errorData
            ) {
              const maybeMessage = (errorData as { message?: unknown }).message;
              if (typeof maybeMessage === "string" && maybeMessage.trim()) {
                msg = maybeMessage;
              }
            }

            throw new Error(msg);
          }

          const rawUser = (await response.json()) as TorcedorITf & {
            token?: string;
            status?: string;
          };

          const token = rawUser.token ?? getToken();

          const torcedor: TorcedorITf = {
            ...rawUser,
            statusSocio: rawUser.statusSocio ?? rawUser.status ?? undefined,
          };

          if (token) {
            setAuthCookie({ token });
          }

          set({ torcedor, token });
        } catch (e: unknown) {
          const errorMessage =
            e instanceof Error ? e.message : "Erro ao fazer login";

          console.error("Erro no login:", e);
          toast.error(errorMessage);
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      loginSilencioso: async (email, senha) => {
        try {
          await get().login(email, senha);
          return true;
        } catch {
          return false;
        }
      },

      logout: async () => {
        set({ torcedor: null, token: undefined });
        removeAuthCookie();
        toast.success("Você saiu da sua conta.");
      },

      fetchMe: async () => {
        try {
          const currentToken = get().token ?? getToken();

          if (!currentToken) {
            set({ torcedor: null, token: undefined });
            removeAuthCookie();
            return;
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuario/me`,
            {
              credentials: "include",
              headers: {
                Authorization: `Bearer ${currentToken}`,
              },
            }
          );

          if (response.status === 401) {
            set({ torcedor: null, token: undefined });
            removeAuthCookie();
            return;
          }

          if (!response.ok) {
            throw new Error("Erro ao buscar dados do usuário");
          }

          const rawUser = (await response.json()) as TorcedorITf & {
            token?: string;
            status?: string;
          };

          set((state) => {
            const token = rawUser.token ?? currentToken ?? state.token ?? getToken();

            if (token) {
              setAuthCookie({ token });
            }

            const torcedor: TorcedorITf = {
              ...rawUser,
              statusSocio: rawUser.statusSocio ?? rawUser.status ?? undefined,
            };

            return { torcedor, token };
          });
        } catch (e) {
          console.error("Erro ao buscar dados do usuário:", e);
          toast.error("Erro ao buscar dados do usuário");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s: AuthState) => ({
        torcedor: s.torcedor,
        token: s.token,
      }),
    }
  )
);