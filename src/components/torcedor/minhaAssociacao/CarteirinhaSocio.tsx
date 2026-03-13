"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CarteirinhaSocioProps {
  nome: string;
  matricula: string;
  planoNome: string;
  numeroCartao?: string;
  className?: string;
  fotoUrl?: string | null;
}

export function CarteirinhaSocio({
  nome,
  matricula,
  planoNome,
  numeroCartao,
  className,
  fotoUrl,
}: CarteirinhaSocioProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-lg",
        "bg-gradient-to-br from-red-700 to-red-600",
        "p-5 sm:p-6 rounded-2xl flex flex-col gap-4",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-24 w-20 rounded-xl overflow-hidden bg-red-900/40 flex items-center justify-center">
          {fotoUrl ? (
            <Image
              src={fotoUrl}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-white">
              {nome
                .trim()
                .split(/\s+/)
                .map((n) => n[0] ?? "")
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "US"}
            </span>
          )}
        </div>

        {/* Dados */}
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-semibold leading-none text-red-100">
            Matrícula:
          </p>
          <p className="font-bold text-sm text-white">{matricula}</p>

          {numeroCartao && (
            <>
              <p className="text-[12px] font-semibold leading-none text-red-100 mt-1">
                Cartão:
              </p>
              <p className="font-bold text-sm text-white">{numeroCartao}</p>
            </>
          )}
        </div>
      </div>

      {/* Parte inferior */}
      <div className="flex flex-col">
        <p className="text-white font-bold text-lg leading-tight">
          {nome.toUpperCase()}
        </p>
        <p className="text-yellow-300 font-semibold text-sm tracking-wide">
          {planoNome.toUpperCase()}
        </p>
      </div>
    </Card>
  );
}
