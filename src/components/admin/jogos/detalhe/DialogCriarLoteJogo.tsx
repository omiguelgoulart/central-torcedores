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
import { Plus } from "lucide-react";
import type { JogoSetor } from "@/app/admin/jogos/[id]/page";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

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
  setoresJogo: JogoSetor[]; // precisa disso pra escolher o jogoSetorId
  onCreated: (novo: JogoLote) => void;
};

export function DialogCriarLoteJogo({
  jogoId,
  setoresJogo,
  onCreated,
}: DialogCriarLoteJogoProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] =
    useState<"INTEIRA" | "MEIA" | "CORTESIA" | "PROMO">("INTEIRA");
  const [quantidade, setQuantidade] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [inicioVendas, setInicioVendas] = useState("");
  const [fimVendas, setFimVendas] = useState("");
  const [limitePorCPF, setLimitePorCPF] = useState("");
  const [jogoSetorId, setJogoSetorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!nome.trim()) {
      setErro("Informe um nome para o lote.");
      return;
    }
    if (!jogoSetorId) {
      setErro("Selecione o setor do jogo para este lote.");
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
        jogoId,
        jogoSetorId,
      };

      const res = await fetch(`${API}/admin/lote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("Erro ao criar lote:", errBody);
        throw new Error();
      }

      const body = await res.json(); // { message, loteId }
      const loteId = body.loteId as string;

      // Buscar lote completo para atualizar lista sem recarregar
      const resLote = await fetch(`${API}/admin/lote/${loteId}`);
      const lote: JogoLote = await resLote.json();

      onCreated(lote);

      // reset
      setOpen(false);
      setNome("");
      setTipo("INTEIRA");
      setQuantidade("");
      setPrecoUnitario("");
      setInicioVendas("");
      setFimVendas("");
      setLimitePorCPF("");
      setJogoSetorId("");
    } catch {
      setErro("Não foi possível criar o lote.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Defina setor, tipo, quantidade, valor e período de vendas.
          </DialogDescription>
        </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium">Setor do jogo</label>
              <Select
                value={jogoSetorId}
                onValueChange={(v) => setJogoSetorId(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {setoresJogo.map((sj) => (
                    <SelectItem
                      value={sj.id}
                      key={sj.id}
                    >
                      {sj.setor.nome} ({sj.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Nome do lote</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Lote 1 - Antecipado"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={tipo}
                  onValueChange={(v: "INTEIRA" | "MEIA" | "CORTESIA" | "PROMO") =>
                    setTipo(v)
                  }
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
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
}
