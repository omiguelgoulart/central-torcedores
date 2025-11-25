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
import { Edit2 } from "lucide-react";
import type { JogoLote } from "./DialogCriarLoteJogo";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type DialogEditarLoteJogoProps = {
  lote: JogoLote;
  onUpdated: (lote: JogoLote) => void;
};

export function DialogEditarLoteJogo({
  lote,
  onUpdated,
}: DialogEditarLoteJogoProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(lote.nome);
  const [tipo, setTipo] = useState<JogoLote["tipo"]>(lote.tipo);
  const [quantidade, setQuantidade] = useState(String(lote.quantidade));
  const [precoUnitario, setPrecoUnitario] = useState(
    String(lote.precoUnitario)
  );
  const [inicioVendas, setInicioVendas] = useState(lote.inicioVendas ?? "");
  const [fimVendas, setFimVendas] = useState(lote.fimVendas ?? "");
  const [limitePorCPF, setLimitePorCPF] = useState(
    lote.limitePorCPF != null ? String(lote.limitePorCPF) : ""
  );
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!nome.trim()) {
      setErro("Informe um nome para o lote.");
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

      const payload = {
        nome,
        tipo,
        quantidade: Number(quantidade),
        precoUnitario: Number(precoUnitario),
        inicioVendas: inicioVendas || undefined,
        fimVendas: fimVendas || undefined,
        limitePorCPF: limitePorCPF ? Number(limitePorCPF) : undefined,
        jogoId: lote.jogoId,
        jogoSetorId: lote.jogoSetorId,
      };

      const res = await fetch(`${API}/admin/lote/${lote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Erro ao atualizar lote:", body);
        throw new Error();
      }

      const atualizado: JogoLote = {
        ...lote,
        ...payload,
        inicioVendas: payload.inicioVendas ?? null,
        fimVendas: payload.fimVendas ?? null,
        limitePorCPF: payload.limitePorCPF ?? null,
      };

      onUpdated(atualizado);
      setOpen(false);
    } catch {
      setErro("Não foi possível atualizar o lote.");
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
          <DialogTitle>Editar lote</DialogTitle>
          <DialogDescription>
            Ajuste tipo, quantidade, valor ou período deste lote.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Nome do lote</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as JogoLote["tipo"])}>
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
              <label className="text-sm font-medium">
                Preço unitário (R$)
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={precoUnitario}
                onChange={(e) => setPrecoUnitario(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
