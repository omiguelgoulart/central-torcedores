"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useAdminJogo } from "@/hooks/useAdminJogo";

type Props = {
  id: string;
  onDeleted: (id: string) => void;
};

export function DeletaJogo({ id, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const { deleteJogo } = useAdminJogo();

  async function handleDelete() {
    const confirmar = window.confirm("Tem certeza que deseja excluir este jogo?");
    if (!confirmar) return;

    setLoading(true);

    try {
      await deleteJogo(id);
      onDeleted(id);
    } catch {
      alert("Erro ao deletar jogo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 text-destructive"
      disabled={loading}
      onClick={handleDelete}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
