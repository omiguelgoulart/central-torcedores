"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: string;
  descricao: ReactNode;
  palavraConfirmacao?: string;
  onConfirm: () => Promise<void>;
  loading?: boolean;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  titulo,
  descricao,
  palavraConfirmacao = "EXCLUIR",
  onConfirm,
  loading = false,
}: Props) {
  const [digitado, setDigitado] = useState("");

  function handleOpenChange(next: boolean) {
    if (loading) return;
    if (!next) setDigitado("");
    onOpenChange(next);
  }

  async function handleConfirm() {
    await onConfirm();
    setDigitado("");
  }

  const confirmado = digitado === palavraConfirmacao;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">{titulo}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              {descricao}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="confirm-delete-input">
            Digite{" "}
            <span className="font-mono font-semibold text-foreground">
              {palavraConfirmacao}
            </span>{" "}
            para confirmar
          </Label>
          <Input
            id="confirm-delete-input"
            value={digitado}
            onChange={(e) => setDigitado(e.target.value)}
            placeholder={palavraConfirmacao}
            disabled={loading}
            autoComplete="off"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!confirmado || loading}
            onClick={handleConfirm}
          >
            {loading ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
