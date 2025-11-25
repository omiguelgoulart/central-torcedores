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
import type { JogoSetor } from "@/app/admin/jogos/[id]/page";
import { DialogCriarSetorJogo } from "./DialogCriarSetorJogo";
import { DialogEditarSetorJogo } from "./DialogEditarJogo";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export type AbaSetoresJogoProps = {
  jogoId: string;
  setores: JogoSetor[];
  onSetoresChange: (setores: JogoSetor[]) => void;
};

export function AbaSetoresJogo({
  jogoId,
  setores,
  onSetoresChange,
}: AbaSetoresJogoProps) {
  async function handleDelete(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover este setor do jogo?"
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`${API}/admin/jogoSetor/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      onSetoresChange(setores.filter((s) => s.id !== id));
    } catch {
      alert("Não foi possível remover o setor.");
    }
  }

  function handleCreated(novo: JogoSetor) {
    onSetoresChange([...setores, novo]);
  }

  function handleUpdated(atualizado: JogoSetor) {
    onSetoresChange(
      setores.map((s) => (s.id === atualizado.id ? atualizado : s))
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Setores</h2>
        <DialogCriarSetorJogo
          jogoId={jogoId}
          setoresExistentes={setores}
          onCreated={handleCreated}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs text-muted-foreground">
                  <TableHead className="py-3 text-left">Setor</TableHead>
                  <TableHead className="py-3 text-left">Tipo</TableHead>
                  <TableHead className="py-3 text-left">Capacidade</TableHead>
                  <TableHead className="py-3 text-left">Status</TableHead>
                  <TableHead className="py-3 text-left">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {setores.map((s) => (
                  <TableRow
                    key={s.id}
                    className="hover:bg-muted/40 text-sm"
                  >
                    <TableCell className="py-3">
                      {s.setor.nome}
                    </TableCell>
                    <TableCell className="py-3 text-xs">
                      {s.tipo}
                    </TableCell>
                    <TableCell className="py-3">
                      {s.capacidade}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant={s.aberto ? "default" : "secondary"}>
                        {s.aberto ? "Aberto" : "Fechado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-2">
                        <DialogEditarSetorJogo
                          setor={s}
                          onUpdated={handleUpdated}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {setores.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhum setor vinculado a este jogo.
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
