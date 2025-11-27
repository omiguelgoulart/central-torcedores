"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CardSetorProps {
  jogoId: string;
  setor: {
    jogoSetorId: string; // id do jogo_setor (tabela de relação)
    setorId: string; // id do setor (tabela setor)
    nome: string;
    preco: number; // precoUnitario do lote
    disponibilidade: number;
    loteId: string; // id do lote (da API)
  };
  onCancel?: () => void;
}

export function CardSetor({ jogoId, setor, onCancel }: CardSetorProps) {
  const router = useRouter();

  const confirmar = () => {
    const params = new URLSearchParams();
    params.set("description", `Ingresso - ${setor.nome}`);
    params.set("subtotal", setor.preco.toString());
    params.set("fees", "0");
    params.set("total", setor.preco.toString());
    params.set("setorId", setor.setorId);
    params.set("loteId", setor.loteId);
    params.set("jogoId", jogoId); // id do jogo (partida)
    params.set("jogoSetorId", setor.jogoSetorId); // id da relação jogo_setor

    router.push(`/pagamento?${params.toString()}`);
  };

  const descricao = [
    { label: "Setor", value: setor.nome },
    {
      label: "Preço",
      value: setor.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    },
    {
      label: "Disponibilidade",
      value: `${setor.disponibilidade} lugares`,
    },
  ];

  return (
    <Card className="shadow-none border-0 p-4">
      <CardHeader className="px-0 pt-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Confirme seu setor
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        <div className="space-y-2 text-sm">
          {descricao.map((item) => (
            <div className="flex items-center justify-between" key={item.label}>
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel ?? (() => router.back())}
          >
            Cancelar
          </Button>

          <Button type="button" onClick={confirmar}>
            Confirmar setor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
