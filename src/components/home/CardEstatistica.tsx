"use client";

import { Card, CardContent } from "@/components/ui/card";

export function CardEstatistica({
  valor,
  rotulo,
}: {
  valor: string | number;
  rotulo: string;
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{valor}</div>
        <div className="text-sm text-gray-600">{rotulo}</div>
      </CardContent>
    </Card>
  );
}
