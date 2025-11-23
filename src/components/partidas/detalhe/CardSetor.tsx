"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CardSetorProps {
  partidaId: string;
  setor: {
    id: string;
    nome: string;
    preco: number;
    disponibilidade: number;
  };
  onCancel?: () => void; // ← agora é opcional, com fallback
}

export function CardSetor({ partidaId, setor, onCancel }: CardSetorProps) {
  const router = useRouter();

  // 👉 Direciona direto para a página de pagamento com os dados do setor
  const confirmar = () => {
    const query = new URLSearchParams({
      description: `Ingresso - ${setor.nome}`,
      subtotal: setor.preco.toString(),
      fees: "0",
      total: setor.preco.toString(),
      setorId: setor.id,
      partidaId,
    }).toString();

    router.push(`/pagamento?${query}`);
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
            <div
              className="flex items-center justify-between"
              key={item.label}
            >
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel ?? (() => router.back())} // fallback seguro
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
