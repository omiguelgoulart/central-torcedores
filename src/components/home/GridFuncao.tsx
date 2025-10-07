"use client";

import { CardFuncao, Funcao } from "./CardFuncao";


export function GridFuncao({ itens }: { itens: Funcao[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {itens.map((item) => (
        <CardFuncao key={item.link} {...item} />
      ))}
    </div>
  );
}
