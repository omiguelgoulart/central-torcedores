"use client";

import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { Button } from "@/components/ui/button";

type CheckinScannerProps = {
  cameraActive: boolean;
  isProcessing: boolean;
  onOpenCamera: () => void;
  onCloseCamera: () => void;
  onDecoded: (payload: string) => void;
};

export function CheckinScanner({
  cameraActive,
  isProcessing,
  onOpenCamera,
  onCloseCamera,
  onDecoded,
}: CheckinScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  // Refs para evitar stale closure no callback de scan contínuo
  const isProcessingRef = useRef(isProcessing);
  const onDecodedRef = useRef(onDecoded);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    onDecodedRef.current = onDecoded;
  }, [onDecoded]);

  useEffect(() => {
    if (!cameraActive || !videoRef.current) return;

    const reader = new BrowserMultiFormatReader();

    void reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current,
        (result) => {
          if (result && !isProcessingRef.current) {
            onDecodedRef.current(result.getText());
          }
        },
      )
      .then((controls) => {
        controlsRef.current = controls;
      });

    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [cameraActive]);

  function handleClose() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    onCloseCamera();
  }

  return (
    <>
      {!cameraActive && (
        <Button className="w-full" onClick={onOpenCamera}>
          Abrir câmera e ler QR Code
        </Button>
      )}

      {cameraActive && (
        <div className="space-y-2">
          <div className="w-full rounded-xl border overflow-hidden bg-muted aspect-square">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleClose}
          >
            Fechar câmera
          </Button>
        </div>
      )}
    </>
  );
}
