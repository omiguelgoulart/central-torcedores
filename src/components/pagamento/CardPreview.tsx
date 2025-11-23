"use client";

import Image from "next/image";
import { CreditCard } from "lucide-react";
import type { CardBrand } from "@/app/types/pagamentoItf";
import { getCardBrandName } from "@/lib/card-utils";

interface CardPreviewProps {
  holderName: string;
  number: string;
  expiry: string;
  brand: CardBrand;
}

export function CardPreview({
  holderName,
  number,
  expiry,
  brand,
}: CardPreviewProps) {
  const numeroExibicao = number || "•••• •••• •••• ••••";
  const nomeExibicao = holderName || "NOME NO CARTÃO";
  const validadeExibicao = expiry || "MM/AA";

  // cor cartao
  const coresBandeira: Record<CardBrand, string> = {
    visa: "from-blue-600 to-blue-800",
    mastercard: "from-red-600 to-orange-600",
    elo: "from-yellow-500 to-yellow-700",
    amex: "from-blue-500 to-blue-700",
    hipercard: "from-red-700 to-red-900",
    unknown: "from-slate-600 to-slate-800",
  };

  // logo bandeira
  const logosBandeira: Record<CardBrand, string | null> = {
    visa: "/visa.svg",
    mastercard: "/mastercard.svg",
    elo: "/elo.svg",
    amex: "/amex.svg",
    hipercard: "/hipercard.svg",
    unknown: null,
  };

  return (
    <div
      className={`relative w-full aspect-[1.586/1] rounded-xl bg-gradient-to-br ${coresBandeira[brand]} p-6 text-white shadow-xl transition-all duration-300`}
    >
      {/* Chip do cartão */}
      <div className="absolute top-6 left-6 w-12 h-10 rounded bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-80" />

      {/* Logo da bandeira */}
      <div className="absolute top-6 right-6">
        {logosBandeira[brand] ? (
          <div className="bg-white/90 rounded">
            <Image
              src={logosBandeira[brand]!}
              alt={getCardBrandName(brand)}
              width={56}
              height={24}
              className="h-6 w-auto object-contain"
              priority
            />
            <span className="sr-only">{getCardBrandName(brand)}</span>
          </div>
        ) : (
          <CreditCard className="w-8 h-8 opacity-50" />
        )}
      </div>

      {/* Número do cartão */}
      <div className="absolute bottom-16 left-6 right-6">
        <p className="text-xl font-mono tracking-wider">{numeroExibicao}</p>
      </div>

      {/* Nome e validade */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        <div>
          <p className="text-xs opacity-70 mb-1">Nome do Titular</p>
          <p className="text-sm font-semibold uppercase tracking-wide">
            {nomeExibicao}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-70 mb-1">Validade</p>
          <p className="text-sm font-mono">{validadeExibicao}</p>
        </div>
      </div>
    </div>
  );
}
