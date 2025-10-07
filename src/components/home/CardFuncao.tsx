"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export type Funcao = {
  titulo: string;
  descricao: string;
  icone: ReactNode;
  link: string;
};

export function CardFuncao({ titulo, descricao, icone, link }: Funcao) {
  return (
    <Link href={link} className="h-full">
      <Card className="border-gray-200 hover:border-gray-300 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl" aria-hidden>
              {icone}
            </div>
            <CardTitle className="text-lg text-gray-900">{titulo}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm mb-4">{descricao}</p>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            Acessar
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
