"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ValorSetor } from "./ExibicaoMapaSetor";

interface CardSetorProps {
  jogoId: string;
  setor: ValorSetor;
  onCancel?: () => void;
}

export function CardSetor({ jogoId, setor, onCancel }: CardSetorProps) {
  const router = useRouter();

  const loteAtivo = setor.lotes?.[0];

  const precoFinal = loteAtivo?.preco ?? setor.preco ?? 0;

  const nomeSetor = setor.nome ?? "Setor não identificado";
  const disponibilidade = setor.capacidade ?? 0;

  const confirmar = () => {
    if (!loteAtivo) {
      alert("Não há lotes disponíveis para este setor.");
      return;
    }

    const params = new URLSearchParams();
    params.set("description", `Ingresso - ${nomeSetor}`);
    params.set("subtotal", precoFinal.toString());
    params.set("fees", "0");
    params.set("total", precoFinal.toString());
    params.set("setorId", setor.setorId);
    params.set("loteId", loteAtivo.id);
    params.set("jogoId", jogoId);
    params.set("jogoSetorId", setor.jogoSetorId);

    router.push(`/pagamento?${params.toString()}`);
  };

  const itensExibicao = [
    { label: "Setor", value: nomeSetor },
    {
      label: "Lote",
      value: loteAtivo?.nome ?? "Nenhum lote ativo",
    },
    {
      label: "Preço",
      value: precoFinal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    },
    {
      label: "Capacidade",
      value: `${disponibilidade} lugares`,
    },
  ];

  return (
    <Card className="shadow-none border border-border/50 bg-background/50 p-4">
      <CardHeader className="px-0 pt-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Confirme seu setor
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        <div className="space-y-2 text-sm">
          {itensExibicao.map((item) => (
            <div className="flex items-center justify-between" key={item.label}>
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-medium text-right">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={confirmar}
            disabled={!loteAtivo || !setor.aberto}
          >
            {setor.aberto ? "Confirmar setor" : "Setor Fechado"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
