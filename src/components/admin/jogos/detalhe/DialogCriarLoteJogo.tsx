"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus } from "lucide-react";
import type { JogoSetor } from "@/app/admin/jogos/[id]/page";
import { useAdminLote } from "@/hooks/useAdminLote";

export type JogoLote = {
  id: string;
  nome: string;
  tipo: "INTEIRA" | "MEIA" | "CORTESIA" | "PROMO";
  quantidade: number;
  precoUnitario: number;
  inicioVendas: string | null;
  fimVendas: string | null;
  limitePorCPF: number | null;
  jogoId: string;
  jogoSetorId: string;
};

type DialogCriarLoteJogoProps = {
  jogoId: string;
  jogoData?: string;
  setoresJogo: JogoSetor[];
  onCreated: (novos: JogoLote[]) => void;
};

function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DialogCriarLoteJogo({
  jogoId,
  jogoData,
  setoresJogo,
  onCreated,
}: DialogCriarLoteJogoProps) {
  const hoje = toDateInput(new Date());
  const dataJogo = jogoData ? toDateInput(new Date(jogoData)) : hoje;

  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"INTEIRA" | "MEIA" | "CORTESIA" | "PROMO">("INTEIRA");
  const [quantidade, setQuantidade] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [inicioVendas, setInicioVendas] = useState(hoje);
  const [fimVendas, setFimVendas] = useState(dataJogo);
  const [limitePorCPF, setLimitePorCPF] = useState("");
  const [setoresSelecionados, setSetoresSelecionados] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { createLote, fetchLoteById } = useAdminLote();

  function toggleSetor(id: string) {
    setSetoresSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      if (next.size === 0) {
        setQuantidade("");
      } else {
        const caps = setoresJogo
          .filter((sj) => next.has(sj.id))
          .map((sj) => sj.capacidade)
          .filter((c) => c > 0);
        if (caps.length > 0) setQuantidade(String(caps.reduce((a, b) => a + b, 0)));
      }

      return next;
    });
  }

  function reset() {
    setNome("");
    setTipo("INTEIRA");
    setQuantidade("");
    setPrecoUnitario("");
    setInicioVendas(hoje);
    setFimVendas(dataJogo);
    setLimitePorCPF("");
    setSetoresSelecionados(new Set());
    setErro(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!nome.trim()) {
      setErro("Informe um nome para o lote.");
      return;
    }
    if (setoresSelecionados.size === 0) {
      setErro("Selecione ao menos um setor.");
      return;
    }
    if (!quantidade || Number(quantidade) <= 0) {
      setErro("Informe uma quantidade válida.");
      return;
    }
    if (!precoUnitario || Number(precoUnitario) < 0) {
      setErro("Informe um preço unitário válido.");
      return;
    }

    try {
      setLoading(true);
      setErro(null);

      const criados: JogoLote[] = [];

      for (const jogoSetorId of setoresSelecionados) {
        const payload = {
          nome,
          tipo,
          quantidade: Number(quantidade),
          precoUnitario: Number(precoUnitario),
          inicioVendas: inicioVendas || undefined,
          fimVendas: fimVendas || undefined,
          limitePorCPF: limitePorCPF ? Number(limitePorCPF) : undefined,
          jogoId,
          jogoSetorId,
        };

        const result = await createLote(payload);
        const lote = await fetchLoteById<JogoLote>(result.loteId);
        criados.push(lote);
      }

      onCreated(criados);
      setOpen(false);
      reset();
    } catch {
      setErro("Não foi possível criar o lote.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Lote
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo lote do jogo</DialogTitle>
          <DialogDescription>
            Defina os setores, tipo, quantidade, valor e período de vendas.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Setores do jogo</label>
            {setoresJogo.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhum setor vinculado a este jogo.
              </p>
            ) : (
              <div className="border rounded-md divide-y">
                {setoresJogo.map((sj) => (
                  <label
                    key={sj.id}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40"
                  >
                    <Checkbox
                      checked={setoresSelecionados.has(sj.id)}
                      onCheckedChange={() => toggleSetor(sj.id)}
                    />
                    <span className="text-sm">
                      {sj.setor?.nome ?? sj.setorId}
                      {sj.setor?.tipo && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({sj.setor.tipo})
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Nome do lote</label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Lote 1 - Antecipado"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={tipo}
                onValueChange={(v: "INTEIRA" | "MEIA" | "CORTESIA" | "PROMO") => setTipo(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTEIRA">Inteira</SelectItem>
                  <SelectItem value="MEIA">Meia</SelectItem>
                  <SelectItem value="CORTESIA">Cortesia</SelectItem>
                  <SelectItem value="PROMO">Promoção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Quantidade</label>
              <Input
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Preço unitário (R$)</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={precoUnitario}
                onChange={(e) => setPrecoUnitario(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Início das vendas</label>
              <Input
                type="date"
                value={inicioVendas}
                onChange={(e) => setInicioVendas(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Fim das vendas</label>
              <Input
                type="date"
                value={fimVendas}
                onChange={(e) => setFimVendas(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Limite por CPF</label>
              <Input
                type="number"
                min={1}
                value={limitePorCPF}
                onChange={(e) => setLimitePorCPF(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" disabled={loading} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || setoresJogo.length === 0}>
              {loading
                ? `Criando ${setoresSelecionados.size} lote(s)...`
                : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
