"use client";

import { useState } from "react";
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
import { DownloadIcon, FileTextIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

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

type BoletoGerado = {
  bankSlipUrl?: string;
  invoiceUrl?: string;
  dueDate?: string;
};

interface TabelaPagamentosSocioProps {
  parcelas: ParcelaRegistro[];
  torcedorId?: string;
}

export function TabelaPagamentosSocio({ parcelas, torcedorId }: TabelaPagamentosSocioProps) {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [boleto, setBoleto] = useState<BoletoGerado | null>(null);

  const ordenadas = [...parcelas].sort(
    (a, b) =>
      new Date(a.dataVencimento).getTime() -
      new Date(b.dataVencimento).getTime()
  );

  const parcelaSelecionada = ordenadas.find((p) => p.id === selecionado);

  function handleCheck(id: string) {
    setSelecionado((prev) => (prev === id ? null : id));
    setBoleto(null);
  }

  async function gerarBoleto() {
    if (!selecionado) return;
    setGerando(true);
    setBoleto(null);

    try {
      const res = await fetch(`${API}/fatura/${selecionado}/boleto`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error ?? "Erro ao gerar boleto.");
        return;
      }

      setBoleto(data as BoletoGerado);
      toast.success("Boleto gerado com sucesso!");
    } catch {
      toast.error("Falha ao gerar boleto.");
    } finally {
      setGerando(false);
    }
  }

  void torcedorId; // usado pelo pai para contexto; não necessário aqui diretamente

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
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenadas.map((p) => {
                    const podeGerar = p.status !== "PAGO";
                    return (
                      <TableRow
                        key={p.id}
                        className={selecionado === p.id ? "bg-muted/50" : ""}
                        onClick={() => podeGerar && handleCheck(p.id)}
                        style={{ cursor: podeGerar ? "pointer" : "default" }}
                      >
                        <TableCell>
                          {podeGerar && (
                            <Checkbox
                              checked={selecionado === p.id}
                              onCheckedChange={() => handleCheck(p.id)}
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

            {selecionado && parcelaSelecionada?.status !== "PAGO" && (
              <div className="space-y-3 pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Parcela selecionada:{" "}
                  <strong>{parcelaSelecionada?.numeroParcela}</strong> —
                  venc.{" "}
                  {parcelaSelecionada
                    ? formatDate(parcelaSelecionada.dataVencimento)
                    : ""}
                </p>

                {!boleto ? (
                  <Button
                    onClick={gerarBoleto}
                    disabled={gerando}
                    className="w-full"
                  >
                    {gerando ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Gerando boleto...
                      </>
                    ) : (
                      <>
                        <FileTextIcon className="mr-2 size-4" />
                        {parcelaSelecionada?.jaTemBoleto
                          ? "Ver Boleto"
                          : "Gerar Boleto"}
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    {boleto.bankSlipUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() =>
                          window.open(boleto.bankSlipUrl!, "_blank")
                        }
                      >
                        <DownloadIcon className="mr-2 size-4" />
                        Baixar Boleto Bancário
                      </Button>
                    )}
                    {boleto.invoiceUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() =>
                          window.open(boleto.invoiceUrl!, "_blank")
                        }
                      >
                        <DownloadIcon className="mr-2 size-4" />
                        Baixar Nota Fiscal
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      O pagamento pode levar até 3 dias úteis para ser
                      confirmado.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
