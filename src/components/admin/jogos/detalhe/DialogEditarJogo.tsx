"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit2 } from "lucide-react";
import type { JogoSetor } from "@/app/admin/jogos/[id]/page";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export type DialogEditarSetorJogoProps = {
  setor: JogoSetor;
  onUpdated: (setor: JogoSetor) => void;
};

export function DialogEditarSetorJogo({
  setor,
  onUpdated,
}: DialogEditarSetorJogoProps) {
  const [open, setOpen] = useState(false);
  const [capacidade, setCapacidade] = useState(String(setor.capacidade));
  const [tipo, setTipo] = useState(setor.tipo);
  const [aberto, setAberto] = useState(setor.aberto);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!capacidade || Number(capacidade) <= 0) {
      setErro("Informe uma capacidade válida.");
      return;
    }

    try {
      setLoading(true);
      setErro(null);

      const payload = {
        capacidade: Number(capacidade),
        tipo,
        aberto,
      };

      const res = await fetch(`${API}/admin/jogoSetor/${setor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const data: JogoSetor = await res.json();
      onUpdated(data);
      setOpen(false);
    } catch {
      setErro("Não foi possível atualizar o setor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar setor</DialogTitle>
          <DialogDescription>
            Ajuste as informações deste setor para o jogo.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Setor</label>
            <Input value={setor.setor.nome} disabled />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Capacidade</label>
              <Input
                type="number"
                min={1}
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARQUIBANCADA">Arquibancada</SelectItem>
                  <SelectItem value="CADEIRA">Cadeira</SelectItem>
                  <SelectItem value="CAMAROTE">Camarote</SelectItem>
                  <SelectItem value="VISITANTE">Visitante</SelectItem>
                  <SelectItem value="ACESSIVEL">Acessível</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={aberto}
              onCheckedChange={setAberto}
              id={`setor-aberto-${setor.id}`}
            />
            <label
              htmlFor={`setor-aberto-${setor.id}`}
              className="text-sm"
            >
              Setor aberto para venda
            </label>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
