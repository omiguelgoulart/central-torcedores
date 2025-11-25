"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Ingresso } from "@/app/admin/jogos/[id]/page";

type Props = {
  ingressos: Ingresso[];
};

export function AbaIngressosJogo({ ingressos }: Props) {
  const [busca, setBusca] = useState("");

  const filtrados = ingressos.filter((i) =>
    i.qrCode.toLowerCase().includes(busca.toLowerCase().trim())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-lg font-semibold">Ingressos</h2>
        <Input
          placeholder="Buscar QRCode..."
          className="w-48"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs text-muted-foreground">
                  <TableHead className="py-3 text-left">QRCode</TableHead>
                  <TableHead className="py-3 text-left">Status</TableHead>
                  <TableHead className="py-3 text-left">Torcedor</TableHead>
                  <TableHead className="py-3 text-left">Lote</TableHead>
                  <TableHead className="py-3 text-left">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((i) => (
                  <TableRow
                    key={i.id}
                    className="hover:bg-muted-40 text-sm"
                  >
                    <TableCell className="py-3 font-mono text-xs">
                      {i.qrCode}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant={
                          i.status === "VALIDO"
                            ? "default"
                            : i.status === "USADO"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {i.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      {i.socio?.nome ?? "-"}
                    </TableCell>
                    <TableCell className="py-3">
                      {i.lote?.nome ?? "-"}
                    </TableCell>
                    <TableCell className="py-3">
                      <Button variant="ghost" size="sm">
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      Nenhum ingresso encontrado.
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
