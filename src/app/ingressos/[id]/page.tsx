"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ingressoItf } from "@/app/types/ingressoItf";
import { useAuth } from "@/hooks/useAuth";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

const statusConfig = {
  VALIDO: {
    label: "Válido",
    className: "bg-red-600 text-white hover:bg-red-700",
  },
  USADO: {
    label: "Usado",
    className: "bg-gray-500 text-white hover:bg-gray-600",
  },
  CANCELADO: {
    label: "Cancelado",
    className: "bg-red-500 text-white hover:bg-red-600",
  },
} as const;

export default function IngressoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const ingressoId = params.id as string;

  const [ingresso, setIngresso] = useState<ingressoItf | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ingressoId) return;

    const controller = new AbortController();

    async function loadIngresso() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API}/admin/ingresso/${ingressoId}`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Ingresso não encontrado.");
            setIngresso(null);
            return;
          }
          const data = (await res.json().catch(() => null)) as
            | { error?: string; message?: string }
            | null;
          setError(data?.error ?? data?.message ?? "Erro ao carregar ingresso.");
          setIngresso(null);
          return;
        }

        const data = (await res.json()) as ingressoItf;
        setIngresso(data);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Erro ao carregar ingresso.");
        setIngresso(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadIngresso();

    return () => {
      controller.abort();
    };
  }, [ingressoId, token]);

  const status = ingresso ? statusConfig[ingresso.status] ?? statusConfig.VALIDO : null;
  const jogo = ingresso?.jogo;
  const lote = ingresso?.lote;
  const nome = ingresso?.jogo?.nome || "Ingresso";

  const dataFormatada = useMemo(() => {
    if (!jogo?.dataHora) return "Data indisponível";
    return new Date(jogo.dataHora).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  }, [jogo?.dataHora]);

  const horaFormatada = useMemo(() => {
    if (!jogo?.dataHora) return "Hora indisponível";
    return new Date(jogo.dataHora).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [jogo?.dataHora]);

const qrCodeSrc = useMemo(() => {
  if (!ingresso) return "/placeholder.svg";

  if ("qrPngUrl" in ingresso) {
    const qrPngUrl = (ingresso as unknown as { qrPngUrl?: string }).qrPngUrl;
    if (qrPngUrl) {
      return `${API}${qrPngUrl}`;
    }
  }

  if (ingresso.qrCode && ingresso.qrCode.startsWith("http")) {
    return ingresso.qrCode;
  }

  return `${API}/admin/ingresso/${ingresso.id}/qrcode.png`;
}, [ingresso]);


  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Carregando ingresso...</p>
        </div>
      </main>
    );
  }

  if (error || !ingresso) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {error ?? "Ingresso não encontrado"}
          </h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full h-full px-4 py-6 md:py-12 md:px-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card className="overflow-hidden border border-border bg-card">
            <CardHeader className="bg-red-600 text-white pb-4 md:pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl">
                    {nome}
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    Seu Ingresso
                  </CardDescription>
                </div>
                {status && (
                  <Badge
                    className={`${status.className} border-0 text-sm w-fit`}
                  >
                    {status.label}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-6 md:pt-8 space-y-6 md:space-y-8">
              {/* Informações do Jogo */}
              <div className="space-y-4 pb-6 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Data e Hora
                    </p>
                    <p className="text-base md:text-lg font-semibold text-foreground capitalize">
                      {dataFormatada}
                    </p>
                    <p className="text-foreground font-medium">
                      {horaFormatada}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Estádio
                    </p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {jogo?.estadio || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações do Lote/Setor */}
              <div className="space-y-4 pb-6 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Setor</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {lote?.setor || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Portaria
                    </p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {lote?.nome || "Não informado"}
                    </p>
                  </div>
                </div>
                {lote?.descricao && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Instrução de Acesso
                    </p>
                    <p className="text-foreground">{lote.descricao}</p>
                  </div>
                )}
              </div>

              {/* Valor */}
              <div className="pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-1">Valor</p>
                <p className="text-3xl md:text-4xl font-bold text-red-600">
                  R$ {ingresso.valor}
                </p>
              </div>

              {/* QR Code Grande */}
              <div className="flex flex-col items-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Código de Acesso
                </p>
                <div className="bg-muted p-6 md:p-8 rounded-lg">
                  <img
                    src={qrCodeSrc}
                    alt="QR Code do ingresso"
                    width={250}
                    height={250}
                    className="rounded w-48 h-48 md:w-64 md:h-64"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  ID do Ingresso:{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {ingresso.id}
                  </span>
                </p>
              </div>

              {/* Datas */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                <p>
                  Adquirido em:{" "}
                  {new Date(ingresso.criadoEm).toLocaleDateString("pt-BR")}
                </p>
                {ingresso.usadoEm && (
                  <p>
                    Utilizado em:{" "}
                    {new Date(ingresso.usadoEm).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
