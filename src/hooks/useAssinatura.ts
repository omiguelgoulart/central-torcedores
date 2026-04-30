"use client";

import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

type ErrorPayload = {
  error?: string;
  message?: string;
};

function getErrorMessage(data: unknown, fallback: string): string {
  const body = data as ErrorPayload;
  return body?.error ?? body?.message ?? fallback;
}

async function parseBody(response: Response): Promise<unknown> {
  const ct = response.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) return response.json();
  const text = await response.text();
  return { message: text || `Erro (${response.status})` };
}

export type CriarAssinaturaInput = {
  planoId: string;
  periodicidade?: "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL";
  inicioEm?: string;
};

export type BoletoResult = {
  paymentId: string;
  bankSlipUrl?: string;
  invoiceUrl?: string;
  dueDate?: string;
};

export function useAssinatura() {
  const { token } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const request = useCallback(
    async <T>(
      path: string,
      options?: RequestInit,
      fallbackError?: string,
    ): Promise<T> => {
      if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL não configurada.");

      const response = await fetch(`${baseUrl}${path}`, {
        credentials: "include",
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options?.headers as Record<string, string> | undefined),
        },
      });

      const data = await parseBody(response);
      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, fallbackError ?? "Erro na operação."),
        );
      }

      return data as T;
    },
    [baseUrl, token],
  );

  const criarAssinatura = useCallback(
    (input: CriarAssinaturaInput) =>
      request<{ id: string; [key: string]: unknown }>(
        "/assinatura",
        {
          method: "POST",
          body: JSON.stringify({
            periodicidade: "ANUAL",
            inicioEm: new Date().toISOString(),
            ...input,
          }),
        },
        "Erro ao criar assinatura.",
      ),
    [request],
  );

  const gerarBoleto = useCallback(
    (faturaId: string) =>
      request<BoletoResult>(
        `/fatura/${faturaId}/boleto`,
        { method: "POST" },
        "Erro ao gerar boleto.",
      ),
    [request],
  );

  const cancelarAssinatura = useCallback(
    (assinaturaId: string, motivo?: string) =>
      request<{ message: string }>(
        `/assinatura/${assinaturaId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "CANCELADA",
            canceladaEm: new Date().toISOString(),
            motivoCancelamento: motivo,
          }),
        },
        "Erro ao cancelar assinatura.",
      ),
    [request],
  );

  return { criarAssinatura, gerarBoleto, cancelarAssinatura };
}
