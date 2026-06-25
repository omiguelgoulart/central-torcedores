"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Smartphone } from "lucide-react";
import Cookies from "js-cookie";
import { adminFetch } from "@/lib/adminFetch";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  CheckinScanner,
} from "@/components/admin/checkin/CheckinScanner";
import {
  CheckinResult,
  type CheckinStatus,
  type LastResult,
} from "@/components/admin/checkin/CheckinResultado";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type CheckinResponse = {
  status: CheckinStatus;
  mensagem?: string;
  ingressoId?: string;
  jogo?: {
    id: string;
    nome: string;
    data?: string;
  };
};

type JogoDetalhe = {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao?: string | null;
};


function extractIngressoIdFromQrPayload(payload: string): string {
  try {
    const url = new URL(payload);
    const byIngressoId = url.searchParams.get("ingressoId");
    const byIngresso = url.searchParams.get("ingresso");
    const byId = url.searchParams.get("id");

    if (byIngressoId) return byIngressoId;
    if (byIngresso) return byIngresso;
    if (byId) return byId;
  } catch {
  }

  try {
    const parsed = JSON.parse(payload) as { ingressoId?: string; id?: string };
    if (parsed.ingressoId) return parsed.ingressoId;
    if (parsed.id) return parsed.id;
  } catch {
    // não é JSON, segue
  }

  return payload;
}

export default function CheckinIngressoPorJogoPage({ params }: {  params: Promise<{ jogoId: string }>; }) {
  const { jogoId } = use(params);
  const router = useRouter();

  function handleLogout() {
    Cookies.remove("adminToken");
    Cookies.remove("adminRole");
    Cookies.remove("adminName");
    router.push("/admin/login");
  }

  const [jogo, setJogo] = useState<JogoDetalhe | null>(null);
  const [loadingJogo, setLoadingJogo] = useState(true);
  const [erroJogo, setErroJogo] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const paramsUrl = new URLSearchParams(window.location.search);
    const tokenFromUrl = paramsUrl.get("token") ?? undefined;
    setAccessToken(tokenFromUrl);
  }, []);

  useEffect(() => {
    const carregarJogo = async () => {
      try {
        setLoadingJogo(true);
        setErroJogo(null);
        const response = await adminFetch(`${API}/jogo/${jogoId}`);

        if (!response.ok) {
          setErroJogo("Não foi possível carregar os dados do jogo.");
          setLoadingJogo(false);
          return;
        }

        const jogoApi = (await response.json()) as JogoDetalhe;

        setJogo({
          id: jogoApi.id,
          nome: jogoApi.nome,
          data: jogoApi.data,
          local: jogoApi.local,
          descricao: jogoApi.descricao ?? null,
        });
      } catch {
        setErroJogo("Erro ao carregar informações do jogo.");
      } finally {
        setLoadingJogo(false);
      }
    };

    void carregarJogo();
  }, [jogoId]);

  const handleCheckin = useCallback(
    async (qrPayload: string) => {
      if (isProcessing) return;

      setIsProcessing(true);
      setScanError(null);

      const ingressoId = extractIngressoIdFromQrPayload(qrPayload);

      try {
        const response = await adminFetch(`${API}/admin/checkin/`, {
          method: "POST",
          body: JSON.stringify({ ingressoId, jogoId }),
          ...(accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
        });

        if (!response.ok) {
          setScanError("Não foi possível validar o ingresso. Tente novamente.");
          setIsProcessing(false);
          return;
        }

        const data = (await response.json()) as CheckinResponse;

        const mensagemBase: Record<CheckinStatus, string> = {
          VALIDO: "Check-in realizado com sucesso.",
          USADO: "Este ingresso já foi utilizado.",
          INVALIDO: "Ingresso inválido. Verifique os dados.",
        };

        setLastResult({
          status: data.status,
          mensagem: data.mensagem ?? mensagemBase[data.status],
          ingressoId: data.ingressoId,
          jogoNome: data.jogo?.nome ?? jogo?.nome,
          jogoData: data.jogo?.data ?? jogo?.data,
        });
      } catch {
        setScanError("Erro de comunicação com o servidor. Verifique a conexão.");
      } finally {
        setIsProcessing(false);
      }
    },
    [accessToken, isProcessing, jogoId, jogo]
  );

  const handleReset = () => {
    setLastResult(null);
    setScanError(null);
  };

  const handleOpenCamera = () => {
    setScanError(null);
    setLastResult(null);
    setCameraActive(true);
  };

  const handleCloseCamera = () => {
    setCameraActive(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <Card className="w-full rounded-2xl shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Smartphone className="w-5 h-5" />
                <span>Check-in de ingresso</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4 mr-1" />
                Sair
              </Button>
            </div>
            <CardDescription>
              Use a câmera do celular para ler o QR Code do ingresso e registrar a
              entrada.
            </CardDescription>

            {loadingJogo && (
              <p className="text-xs text-muted-foreground">
                Carregando informações do jogo...
              </p>
            )}

            {erroJogo && (
              <p className="text-xs text-red-600">{erroJogo}</p>
            )}

            {jogo && !erroJogo && (
              <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium">Jogo:</span> {jogo.nome}
                </p>
                <p>
                  <span className="font-medium">Data:</span>{" "}
                  {new Date(jogo.data).toLocaleString("pt-BR")}
                </p>
                <p>
                  <span className="font-medium">Local:</span> {jogo.local}
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            
            <CheckinScanner
              cameraActive={cameraActive}
              isProcessing={isProcessing}
              onOpenCamera={handleOpenCamera}
              onCloseCamera={handleCloseCamera}
              onDecoded={handleCheckin}
            />

            <CheckinResult
              isProcessing={isProcessing}
              scanError={scanError}
              lastResult={lastResult}
              onReset={handleReset}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
