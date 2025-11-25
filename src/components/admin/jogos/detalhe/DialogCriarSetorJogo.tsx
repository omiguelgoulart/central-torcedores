"use client";

import { useEffect, useState } from "react";
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
import { Plus } from "lucide-react";
import type { JogoSetor } from "@/app/admin/jogos/[id]/page";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type SetorBase = {
  id: string;
  nome: string;
  capacidade: number;
};

type DialogCriarSetorJogoProps = {
  jogoId: string;
  setoresExistentes: JogoSetor[];
  onCreated: (novo: JogoSetor) => void;
};

export function DialogCriarSetorJogo({
  jogoId,
  setoresExistentes,
  onCreated,
}: DialogCriarSetorJogoProps) {
  const [open, setOpen] = useState(false);
  const [setoresDisponiveis, setSetoresDisponiveis] = useState<SetorBase[]>([]);
  const [setorId, setSetorId] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [tipo, setTipo] = useState("ARQUIBANCADA");
  const [aberto, setAberto] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregou, setCarregou] = useState(false);

  useEffect(() => {
    if (!open) return;

    const carregarSetores = async () => {
      try {
        setErro(null);
        setCarregou(false);

        const res = await fetch(`${API}/admin/setor`);
        if (!res.ok) throw new Error();

        const data: SetorBase[] = await res.json();
        const usados = new Set(setoresExistentes.map((s) => s.setorId));
        const disponiveis = data.filter((s) => !usados.has(s.id));
        setSetoresDisponiveis(disponiveis);
      } catch {
        setErro("Não foi possível carregar os setores.");
        setSetoresDisponiveis([]);
      } finally {
        setCarregou(true);
      }
    };

    carregarSetores();
  }, [open, setoresExistentes]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!setorId) {
      setErro("Selecione um setor.");
      return;
    }
    if (!capacidade || Number(capacidade) <= 0) {
      setErro("Informe uma capacidade válida.");
      return;
    }

    try {
      setLoading(true);
      setErro(null);

      const payload = {
        jogoId,
        setorId,
        capacidade: Number(capacidade),
        aberto,
        tipo,
      };

      const res = await fetch(`${API}/admin/jogoSetor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const data: JogoSetor = await res.json();
      onCreated(data);
      setOpen(false);
      setSetorId("");
      setCapacidade("");
      setTipo("ARQUIBANCADA");
      setAberto(true);
    } catch {
      setErro("Não foi possível criar o setor.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Setor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Atribuir setor ao jogo</DialogTitle>
          <DialogDescription>
            Selecione um setor já cadastrado e defina a configuração para este jogo.
          </DialogDescription>
        </DialogHeader>

        {carregou && setoresDisponiveis.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todos os setores cadastrados já estão vinculados a este jogo.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium">Setor</label>
              <Select
                value={setorId}
                onValueChange={(value) => {
                  setSetorId(value);

                  const selecionado = setoresDisponiveis.find((s) => s.id === value);
                  if (selecionado && selecionado.capacidade) {
                    setCapacidade(String(selecionado.capacidade));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  {setoresDisponiveis.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                id="setor-aberto"
              />
              <label htmlFor="setor-aberto" className="text-sm">
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
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
