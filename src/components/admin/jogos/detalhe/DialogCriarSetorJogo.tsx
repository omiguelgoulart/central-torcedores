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
import { useAdminJogoSetor, type SetorDisponivel } from "@/hooks/useAdminJogoSetor";

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
  const [setoresDisponiveis, setSetoresDisponiveis] = useState<SetorDisponivel[]>([]);
  const [setorId, setSetorId] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [aberto, setAberto] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregou, setCarregou] = useState(false);
  const { fetchSetores, createJogoSetor } = useAdminJogoSetor();

  const capacidadeDefault: Record<string, string> = {
    ARQUIBANCADA: "5000",
    CADEIRA: "2000",
    CAMAROTE: "500",
    VISITANTE: "1000",
    ACESSIVEL: "200",
  };

  function handleSetorChange(value: string) {
    setSetorId(value);
    const setor = setoresDisponiveis.find((s) => s.id === value);
    if (setor) {
      setTipo(setor.tipo);
      setCapacidade(capacidadeDefault[setor.tipo] ?? "100");
    }
  }

  useEffect(() => {
    if (!open) return;

    const carregarSetores = async () => {
      try {
        setErro(null);
        setCarregou(false);

        const data = await fetchSetores();
        const usados = new Set(setoresExistentes.map((s) => s.setorId));
        setSetoresDisponiveis(data.filter((s) => !usados.has(s.id)));
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

      const data = await createJogoSetor<JogoSetor>(payload);
      onCreated(data);
      setOpen(false);
      setSetorId("");
      setCapacidade("");
      setTipo("");
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
        <Button size="sm" className="gap-2">
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
                onValueChange={handleSetorChange}
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
                    <SelectValue placeholder="Auto" />
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
