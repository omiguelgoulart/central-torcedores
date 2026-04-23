"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { getToken, removeAuthCookie, setAuthCookie } from "@/lib/storageToken";
import { AdminItf } from "@/app/types/adminItf";
import { TorcedorITf } from "@/app/types/torcedoItfr";

type AuthState = {
  torcedor: TorcedorITf | null;
  admin: AdminItf | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  loginAdmin: (email: string, senha: string) => Promise<void>;
  loginSilencioso: (email: string, senha: string) => Promise<boolean>;
  registerUser: (payload: RegisterUserPayload) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    novaSenha: string
  ) => Promise<{ message?: string; email?: string }>;
  lookupCep: (cep: string, signal?: AbortSignal) => Promise<CepLookupResult>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  token?: string;
};

type RegisterUserPayload = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  enderecoCEP: string;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoUF: string;
  origemCadastro: string;
  aceitaTermosEm: string;
};

type CepLookupResult = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      torcedor: null,
      admin: null,
      loading: false,
      token: getToken(),

      loginAdmin: async (email, senha) => {
        set({ loading: true });

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, senha }),
            }
          );

          if (!response.ok) {
            const errorData: unknown = await response.json().catch(() => ({}));
            let msg = "Login ou senha incorretos";

            if (
              typeof errorData === "object" &&
              errorData !== null &&
              "erro" in errorData
            ) {
              const maybeErro = (errorData as { erro?: unknown }).erro;
              if (typeof maybeErro === "string" && maybeErro.trim()) {
                msg = maybeErro;
              }
            }

            throw new Error(msg);
          }

          const data = (await response.json()) as {
            token: string;
            admin: AdminItf;
          };

          setAuthCookie({ token: data.token });

          const cookieOpts = {
            expires: 7,
            sameSite: "strict" as const,
            secure: process.env.NODE_ENV === "production",
          };
          Cookies.set("adminToken", data.token, cookieOpts);
          if (data.admin.role) Cookies.set("adminRole", String(data.admin.role), cookieOpts);
          if (data.admin.nome) Cookies.set("adminName", data.admin.nome, cookieOpts);

          set({ admin: data.admin, token: data.token });
        } catch (e: unknown) {
          const errorMessage =
            e instanceof Error ? e.message : "Erro ao fazer login";

          console.error("Erro no login admin:", e);
          toast.error(errorMessage);
          throw e;
        } finally {
          set({ loading: false });
        }
      },

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

      registerUser: async (payload) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario`, {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const body: {
          message?: string;
          error?: string;
          errors?: Array<{ message?: string }>;
        } | null = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            body?.message ||
            body?.error ||
            (Array.isArray(body?.errors) ? body.errors[0]?.message : null) ||
            "Erro ao cadastrar";

          throw new Error(message);
        }
      },

      requestPasswordReset: async (email) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
          {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao enviar instrucoes. Tente novamente.");
        }
      },

      resetPassword: async (token, novaSenha) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              novaSenha,
            }),
          }
        );

        const body = (await response.json().catch(() => null)) as {
          error?: string;
          message?: string;
          email?: string;
        } | null;

        if (!response.ok) {
          const message =
            body?.error ?? body?.message ?? "Erro ao redefinir senha. Tente novamente.";
          throw new Error(message);
        }

        return {
          message: body?.message,
          email: body?.email,
        };
      },

      lookupCep: async (cep, signal) => {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
          signal,
        });

        const data = (await response.json()) as {
          erro?: boolean;
          logradouro?: string;
          bairro?: string;
          localidade?: string;
          uf?: string;
        };

        if (data.erro) {
          throw new Error("CEP não encontrado");
        }

        return {
          logradouro: data.logradouro ?? "",
          bairro: data.bairro ?? "",
          localidade: data.localidade ?? "",
          uf: data.uf ?? "",
        };
      },

      logout: async () => {
        set({ torcedor: null, admin: null, token: undefined });
        removeAuthCookie();
        Cookies.remove("adminToken");
        Cookies.remove("adminRole");
        Cookies.remove("adminName");
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
        admin: s.admin,
        token: s.token,
      }),
    }
  )
);