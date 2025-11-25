"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormJogo, Jogo } from "./FormJogo";

type Props = {
  onCreated?: (jogo: Jogo) => void;
};

export function DialogNovoJogo({ onCreated }: Props) {
  const [open, setOpen] = useState(false);

  function handleSuccess(jogo: Jogo) {
    if (onCreated) onCreated(jogo);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Jogo
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Jogo</DialogTitle>
          <DialogDescription>
            Cadastre um novo jogo para gerenciar setores, lotes e ingressos.
          </DialogDescription>
        </DialogHeader>

        <FormJogo
          mode="create"
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
