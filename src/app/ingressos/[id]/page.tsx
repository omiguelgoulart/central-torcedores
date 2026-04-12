"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

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
import { useIngresso } from "@/hooks/useIngresso";

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
  EXPIRADO: {
    label: "Expirado",
    className: "bg-amber-500 text-white hover:bg-amber-600",
  },
  ESTORNADO: {
    label: "Estornado",
    className: "bg-slate-500 text-white hover:bg-slate-600",
  },
} as const;

export default function IngressoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { ingressoAtual, carregando, erro, buscarIngresso } = useIngresso();

  const ingressoId = params.id as string;
  const ingresso = ingressoAtual;

  useEffect(() => {
    if (!ingressoId) return;

    void buscarIngresso(ingressoId, token ?? undefined);
  }, [ingressoId, token, buscarIngresso]);

  const status = ingresso
    ? (statusConfig[ingresso.status] ?? statusConfig.VALIDO)
    : null;
  const jogo = ingresso?.jogo;
  const lote = ingresso?.lote;
  const nome = ingresso?.jogo?.nome || "Ingresso";

  const dataFormatada = useMemo(() => {
    if (!jogo?.data) return "Data indisponível";
    return new Date(jogo.data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  }, [jogo?.data]);

  const horaFormatada = useMemo(() => {
    if (!jogo?.data) return "Hora indisponível";
    return new Date(jogo.data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [jogo?.data]);

  const valorFormatado = useMemo(() => {
    if (!ingresso?.valor) return "R$ 0,00";
    const num = Number(ingresso.valor);
    if (Number.isNaN(num)) return `R$ ${ingresso.valor}`;
    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [ingresso?.valor]);

  const qrSrc = useMemo(() => {
    if (!ingresso) return "/placeholder.svg";

    const withExtras = ingresso as ingressoItf & {
      qrPngDataUrl?: string;
      qrPngUrl?: string;
    };

    if (withExtras.qrPngDataUrl) {
      return withExtras.qrPngDataUrl;
    }

    if (withExtras.qrPngUrl) {
      return withExtras.qrPngUrl.startsWith("http")
        ? withExtras.qrPngUrl
        : `${API}${withExtras.qrPngUrl}`;
    }

    if (ingresso.qrCode && ingresso.qrCode.startsWith("http")) {
      return ingresso.qrCode;
    }

    return `${API}/ingresso/${ingresso.id}/qrcode.png`;
  }, [ingresso]);

  if (carregando) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Carregando ingresso...
          </p>
        </div>
      </main>
    );
  }

  if (erro || !ingresso) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {erro ?? "Ingresso não encontrado"}
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
                  <CardTitle className="text-xl md:text-2xl">{nome}</CardTitle>
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
                    <p className="text-sm text-muted-foreground mb-1">Local</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {jogo?.local || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações do Lote/Setor */}
              <div className="space-y-4 pb-6 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Lote</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {lote?.nome || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {lote?.tipo || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Valor */}
              <div className="pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-1">Valor</p>
                <p className="text-3xl md:text-4xl font-bold text-red-600">
                  {valorFormatado}
                </p>
              </div>

              {/* QR Code Grande */}
              <div className="flex flex-col items-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Código de Acesso
                </p>
                <div className="bg-muted p-6 md:p-8 rounded-lg">
                  <Image
                    src={qrSrc}
                    alt="QR Code do ingresso"
                    width={250}
                    height={250}
                    className="rounded w-48 h-48 md:w-64 md:h-64"
                    unoptimized
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
