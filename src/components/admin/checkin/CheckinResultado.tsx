"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type CheckinStatus = "VALIDO" | "USADO" | "INVALIDO";

export type LastResult = {
  status: CheckinStatus;
  mensagem: string;
  ingressoId?: string;
  jogoNome?: string;
  jogoData?: string;
};

type CheckinResultProps = {
  isProcessing: boolean;
  scanError: string | null;
  lastResult: LastResult | null;
  onReset: () => void;
};

function getStatusBadge(status: CheckinStatus) {
  if (status === "VALIDO") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
        ✔ Check-in realizado
      </Badge>
    );
  }

  if (status === "USADO") {
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
        ⚠ Ingresso já utilizado
      </Badge>
    );
  }

  return (
    <Badge className="bg-red-100 text-red-800 border-red-200">
      ❌ Ingresso inválido
    </Badge>
  );
}

export function CheckinResult({
  isProcessing,
  scanError,
  lastResult,
  onReset,
}: CheckinResultProps) {
  return (
    <div className="space-y-3">
      {isProcessing && (
        <div className="text-sm text-muted-foreground">
          Validando ingresso, aguarde...
        </div>
      )}

      {scanError && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-2">
          {scanError}
        </div>
      )}

      {lastResult && (
        <div className="space-y-2 border rounded-xl px-3 py-3 bg-slate-50">
          <div>{getStatusBadge(lastResult.status)}</div>
          <p className="text-sm">{lastResult.mensagem}</p>

          {lastResult.ingressoId && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Ingresso:</span> {lastResult.ingressoId}
            </p>
          )}

          {(lastResult.jogoNome || lastResult.jogoData) && (
            <p className="text-xs text-muted-foreground">
              {lastResult.jogoNome && (
                <span className="block">
                  <span className="font-medium">Jogo:</span> {lastResult.jogoNome}
                </span>
              )}
              {lastResult.jogoData && (
                <span className="block">
                  <span className="font-medium">Data:</span>{" "}
                  {new Date(lastResult.jogoData).toLocaleString("pt-BR")}
                </span>
              )}
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            className="mt-1 w-full"
            onClick={onReset}
          >
            Limpar resultado
          </Button>
        </div>
      )}

      {!lastResult && !scanError && !isProcessing && (
        <p className="text-xs text-muted-foreground">
          Dica: depois de tocar em <strong>Abrir câmera</strong>, mantenha o QR Code bem
          enquadrado e com boa iluminação para facilitar a leitura.
        </p>
      )}
    </div>
  );
}
