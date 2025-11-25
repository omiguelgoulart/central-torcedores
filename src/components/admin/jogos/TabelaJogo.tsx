"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit2, Eye } from "lucide-react";
import { DeletaJogo } from "./DeletaJogo";

export type Jogo = {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao?: string | null;
};

type Props = {
  jogos: Jogo[];
  onDelete: (id: string) => void;
};

export function TabelaJogos({ jogos, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-muted-foreground text-xs">
          <TableHead className="py-3 text-left">Nome</TableHead>
          <TableHead className="py-3 text-left">Data</TableHead>
          <TableHead className="py-3 text-left">Local</TableHead>
          <TableHead className="py-3 text-left">Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {jogos.map((jogo) => (
          <TableRow key={jogo.id} className="hover:bg-muted/50 text-sm">
            <TableCell className="py-3 font-medium">{jogo.nome}</TableCell>

            <TableCell className="py-3 text-muted-foreground">
              {new Date(jogo.data).toLocaleDateString("pt-BR")}
            </TableCell>

            <TableCell className="py-3 text-muted-foreground">{jogo.local}</TableCell>

            <TableCell className="py-3">
              <div className="flex gap-2">
                {/* Ver detalhes */}
                <Link href={`/admin/jogos/${jogo.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>

                {/* Ir para a página já no modo edição */}
                <Link href={`/admin/jogos/${jogo.id}?edit=1`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </Link>

                <DeletaJogo id={jogo.id} onDeleted={onDelete} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
