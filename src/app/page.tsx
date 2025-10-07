"use client";

import { funcoes } from "@/components/home/dados";
import { GridEstatistica } from "@/components/home/GridEstatistica";
import { GridFuncao } from "@/components/home/GridFuncao";
import { Header } from "@/components/home/Header";


export default function PaginaDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Sistema
          </h2>
          <p className="text-gray-600">
            Gerencie seus ingressos, pagamentos e benefícios
          </p>
        </div>

        <GridFuncao itens={funcoes} />

        <GridEstatistica />
      </main>
    </div>
  );
}
