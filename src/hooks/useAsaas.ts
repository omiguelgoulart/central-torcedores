"use client";

import { useCallback } from "react";

import { useAuth } from "@/hooks/useAuth";

type RequestOptions = Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>;
};

type AsaasUpstreamError = {
    code?: string;
    description?: string;
};

type ErrorPayload = {
    error?: string;
    message?: string;
    details?: {
        message?: string;
        upstreamStatus?: number;
        upstreamData?: {
            errors?: AsaasUpstreamError[];
        };
    };
};

class AsaasHttpError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
        this.name = "AsaasHttpError";
    }
}

export type CriarClienteAsaasInput = {
    nome: string;
    email: string;
    cpfCnpj?: string;
};

export type CriarPagamentoAsaasInput = {
    customerId: string;
    valor?: number;
    descricao: string;
    dueDate?: string;
    tipo: "PIX" | "BOLETO" | "CREDIT_CARD" | "DEBIT_CARD";
    [key: string]: unknown;
};

async function parseResponseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        return response.json();
    }
    const text = await response.text();
    return { message: text || `Resposta inesperada (${response.status})` };
}

function getErrorMessage(data: unknown, fallback: string) {
    const body = data as ErrorPayload;
    const topLevel = body?.error || body?.message;
    const upstreamDesc = body?.details?.upstreamData?.errors?.[0]?.description;
    if (topLevel && upstreamDesc) return `${topLevel}: ${upstreamDesc}`;
    return topLevel || fallback;
}

export function useAsaas() {
    const { token } = useAuth();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const request = useCallback(
        async <T>(path: string, options?: RequestOptions, fallbackError?: string): Promise<T> => {
            if (!baseUrl) {
                throw new Error("NEXT_PUBLIC_API_URL nao configurada.");
            }

            const response = await fetch(`${baseUrl}/asaas${path}`, {
                credentials: "include",
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...(options?.headers ?? {}),
                },
            });

            const data = await parseResponseBody(response);
            if (!response.ok) {
                throw new AsaasHttpError(
                    getErrorMessage(data, fallbackError ?? "Erro na operacao com Asaas."),
                    response.status,
                );
            }

            return data as T;
        },
        [baseUrl, token],
    );

    const criarCliente = useCallback(
        (input: CriarClienteAsaasInput) =>
            request<{ id: string;[key: string]: unknown }>(
                "/clientes",
                {
                    method: "POST",
                    body: JSON.stringify(input),
                },
                "Erro ao criar cliente no Asaas.",
            ),
        [request],
    );

    const criarPagamento = useCallback(
        (input: CriarPagamentoAsaasInput) =>
            request<{ id: string; status?: string;[key: string]: unknown }>(
                "/pagamentos",
                {
                    method: "POST",
                    body: JSON.stringify(input),
                },
                "Erro ao criar pagamento no Asaas.",
            ),
        [request],
    );

    const obterQrCodePix = useCallback(
        async (paymentId: string) => {
            let lastError: Error | null = null;
            const paths = [`/pagamentos/${paymentId}/pixQrCode`, `/pagamentos/${paymentId}/qrcode`];

            for (const path of paths) {
                try {
                    return await request<{ encodedImage?: string; payload?: string; expirationDate?: string | null }>(
                        path,
                        { method: "GET" },
                        "Erro ao obter QR Code PIX.",
                    );
                } catch (error) {
                    lastError = error instanceof Error ? error : new Error(String(error));
                    if (!(error instanceof AsaasHttpError) || error.status !== 404) {
                        throw lastError;
                    }
                }
            }

            throw lastError ?? new Error("Erro ao obter QR Code PIX.");
        },
        [request],
    );

    const obterStatusPagamento = useCallback(
        (paymentId: string) =>
            request<{ status: string;[key: string]: unknown }>(
                `/pagamentos/${paymentId}/status`,
                { method: "GET" },
                "Erro ao obter status do pagamento.",
            ),
        [request],
    );

    const obterBoletoPdf = useCallback(
        async (paymentId: string) => {
            if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL nao configurada.");

            const response = await fetch(`${baseUrl}/asaas/pagamentos/${paymentId}/boleto`, {
                credentials: "include",
                method: "GET",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                const data = await parseResponseBody(response);
                throw new Error(getErrorMessage(data, "Erro ao obter boleto."));
            }

            return response.blob();
        },
        [baseUrl, token],
    );

    return {
        criarCliente,
        criarPagamento,
        obterQrCodePix,
        obterStatusPagamento,
        obterBoletoPdf,
    };
}
