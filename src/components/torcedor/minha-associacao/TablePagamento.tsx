"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export type StatusParcela = "PAGO" | "A_VENCER" | "VENCIDO";

export interface ParcelaRegistro {
  id: string;
  numeroParcela: string;      // ex: "01/12"
  dataVencimento: string;     // ISO ex: "2025-09-18"
  valor: number;
  status: StatusParcela;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
}

function getStatusLabel(status: StatusParcela) {
  switch (status) {
    case "PAGO":
      return <span className="text-green-600">Pago</span>;
    case "VENCIDO":
      return <span className="text-red-600">Vencido</span>;
    case "A_VENCER":
    default:
      return <span className="text-amber-600">A Vencer</span>;
  }
}

interface TabelaPagamentosSocioProps {
  parcelas: ParcelaRegistro[]; // idealmente já com as 12 parcelas (01/12 ... 12/12)
}

export function TabelaPagamentosSocio({ parcelas }: TabelaPagamentosSocioProps) {
  // Ordena só por data de vencimento (sem quebrar por ano)
  const ordenadas = [...parcelas].sort(
    (a, b) =>
      new Date(a.dataVencimento).getTime() -
      new Date(b.dataVencimento).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resumo de Pagamentos</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {ordenadas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma parcela encontrada para este sócio.
          </p>
        ) : (
          <div className="overflow-x-auto ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordenadas.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">
                      {p.numeroParcela}
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline">
                        {getStatusLabel(p.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(p.dataVencimento)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatCurrency(p.valor)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
