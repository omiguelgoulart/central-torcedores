"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCardIcon } from "lucide-react";

export type StatusParcela = "PAGO" | "A_VENCER" | "VENCIDO";

export interface ParcelaRegistro {
  id: string;
  numeroParcela: string;
  dataVencimento: string;
  valor: number;
  status: StatusParcela;
  jaTemBoleto?: boolean;
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
  parcelas: ParcelaRegistro[];
  torcedorId?: string;
  selecionadas: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
}

export function TabelaPagamentosSocio({
  parcelas,
  selecionadas,
  onToggle,
  onToggleAll,
}: TabelaPagamentosSocioProps) {
  const router = useRouter();

  const ordenadas = useMemo(
    () =>
      [...parcelas].sort(
        (a, b) =>
          new Date(a.dataVencimento).getTime() -
          new Date(b.dataVencimento).getTime(),
      ),
    [parcelas],
  );

  const pagaveis = ordenadas.filter((p) => p.status !== "PAGO");
  const todasSelecionadas =
    pagaveis.length > 0 && pagaveis.every((p) => selecionadas.has(p.id));

  const totalSelecionado = useMemo(
    () =>
      ordenadas
        .filter((p) => selecionadas.has(p.id))
        .reduce((acc, p) => acc + p.valor, 0),
    [ordenadas, selecionadas],
  );

  const parcelasSelecionadas = ordenadas.filter((p) => selecionadas.has(p.id));

  function handleToggleAll() {
    if (todasSelecionadas) {
      onToggleAll([]);
    } else {
      onToggleAll(pagaveis.map((p) => p.id));
    }
  }

  function irParaPagamento() {
    if (parcelasSelecionadas.length === 0) return;

    const descricao =
      parcelasSelecionadas.length === 1
        ? `Parcela ${parcelasSelecionadas[0].numeroParcela}`
        : `${parcelasSelecionadas.length} parcelas selecionadas`;

    const faturaIds = parcelasSelecionadas.map((p) => p.id).join(",");

    const params = new URLSearchParams({
      tipo: "mensalidade",
      description: descricao,
      total: totalSelecionado.toFixed(2),
      subtotal: totalSelecionado.toFixed(2),
      faturaIds,
    });

    router.push(`/pagamento?${params.toString()}`);
  }

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
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      {pagaveis.length > 0 && (
                        <Checkbox
                          checked={todasSelecionadas}
                          onCheckedChange={handleToggleAll}
                          aria-label="Selecionar todas"
                        />
                      )}
                    </TableHead>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenadas.map((p) => {
                    const podeSelecionar = p.status !== "PAGO";
                    const selecionada = selecionadas.has(p.id);
                    return (
                      <TableRow
                        key={p.id}
                        className={selecionada ? "bg-muted/50" : ""}
                        onClick={() => podeSelecionar && onToggle(p.id)}
                        style={{ cursor: podeSelecionar ? "pointer" : "default" }}
                      >
                        <TableCell>
                          {podeSelecionar && (
                            <Checkbox
                              checked={selecionada}
                              onCheckedChange={() => onToggle(p.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {selecionadas.size > 0 && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {selecionadas.size}{" "}
                    {selecionadas.size === 1 ? "parcela" : "parcelas"}
                  </span>{" "}
                  selecionada{selecionadas.size > 1 ? "s" : ""} —{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(totalSelecionado)}
                  </span>
                </div>

                <Button onClick={irParaPagamento} className="gap-2">
                  <CreditCardIcon className="size-4" />
                  Pagar selecionadas
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
