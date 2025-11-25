"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { DialogEditarLoteJogo } from "./DialogEditarLoteJogo";
import { DialogCriarLoteJogo, JogoLote } from "./DialogCriarLoteJogo";
import type { JogoSetor } from "@/app/admin/jogos/[id]/page";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type AbaLotesJogoProps = {
  jogoId: string;
  lotes: JogoLote[];
  setores?: JogoSetor[];
  onLotesChange: (lotes: JogoLote[]) => void;
};

export function AbaLotesJogo({
  jogoId,
  lotes,
  setores,
  onLotesChange,
}: AbaLotesJogoProps) {
  async function handleDelete(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover este lote?"
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`${API}/admin/jogo-lote/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      onLotesChange(lotes.filter((l) => l.id !== id));
    } catch {
      alert("Não foi possível remover o lote.");
    }
  }

  function handleCreated(novo: JogoLote) {
    onLotesChange([...lotes, novo]);
  }

  function handleUpdated(atualizado: JogoLote) {
    onLotesChange(lotes.map((l) => (l.id === atualizado.id ? atualizado : l)));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lotes</h2>
        <DialogCriarLoteJogo
          jogoId={jogoId}
          setoresJogo={setores ?? []}
          onCreated={handleCreated}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs text-muted-foreground">
                  <TableHead className="py-3 text-left">Nome</TableHead>
                  <TableHead className="py-3 text-left">Valor</TableHead>
                  <TableHead className="py-3 text-left">Período</TableHead>
                  <TableHead className="py-3 text-left">Status</TableHead>
                  <TableHead className="py-3 text-left">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.map((lote) => (
                  <TableRow key={lote.id} className="hover:bg-muted/40 text-sm">
                    <TableCell className="py-3">{lote.nome}</TableCell>
                    <TableCell className="py-3">
                      {lote.precoUnitario.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell className="py-3 text-xs">
                      {lote.inicioVendas && lote.fimVendas
                        ? `${formatarData(
                            lote.inicioVendas
                          )} até ${formatarData(lote.fimVendas)}`
                        : "Sem período definido"}
                    </TableCell>
                    <TableCell className="py-3">
                      {(() => {
                        // calcular se o lote está ativo com base no período, se disponível
                        const now = Date.now();
                        let ativo = true;
                        if (lote.inicioVendas && lote.fimVendas) {
                          const inicio = new Date(lote.inicioVendas).getTime();
                          const fim = new Date(lote.fimVendas).getTime();
                          ativo =
                            !Number.isNaN(inicio) &&
                            !Number.isNaN(fim) &&
                            inicio <= now &&
                            now <= fim;
                        }

                        return (
                          <Badge variant={ativo ? "default" : "secondary"}>
                            {ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-2">
                        <DialogEditarLoteJogo
                          lote={lote}
                          onUpdated={handleUpdated}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(lote.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {lotes.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhum lote cadastrado para este jogo.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatarData(valor?: string | null) {
  if (!valor) return "";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return valor;
  return d.toLocaleDateString("pt-BR");
}
