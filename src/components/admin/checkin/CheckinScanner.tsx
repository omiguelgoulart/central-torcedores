"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const QrReader = dynamic(
  () => import("react-qr-reader").then((mod) => mod.QrReader ?? mod.default),
  { ssr: false }
);

type CheckinScannerProps = {
  cameraActive: boolean;
  isProcessing: boolean;
  onOpenCamera: () => void;
  onCloseCamera: () => void;
  onDecoded: (payload: string) => void;
};

function getTextFromResult(result: unknown): string | undefined {
  if (!result || typeof result !== "object") {
    return undefined;
  }

  const candidate = result as { getText?: () => string };
  if (typeof candidate.getText === "function") {
    return candidate.getText();
  }

  return undefined;
}

export function CheckinScanner({
  cameraActive,
  isProcessing,
  onOpenCamera,
  onCloseCamera,
  onDecoded,
}: CheckinScannerProps) {
  const handleResult = useCallback(
    (result: unknown, error: unknown) => {
      if (error) {
        return;
      }

      if (isProcessing) {
        return;
      }

      const text = getTextFromResult(result);
      if (text) {
        onDecoded(text);
      }
    },
    [isProcessing, onDecoded]
  );

  return (
    <>
      {!cameraActive && (
        <Button className="w-full" onClick={onOpenCamera}>
          Abrir câmera e ler QR Code
        </Button>
      )}

      {cameraActive && (
        <div className="space-y-2">
          <div className="w-full rounded-xl border overflow-hidden bg-muted">
            <QrReader
              constraints={{ facingMode: "environment" }}
              scanDelay={500}
              onResult={(result, error) => {
                handleResult(result, error);
              }}
              videoContainerStyle={{
                width: "100%",
                height: "100%",
              }}
              videoStyle={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onCloseCamera}
          >
            Fechar câmera
          </Button>
        </div>
      )}
    </>
  );
}
