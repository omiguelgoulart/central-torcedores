"use client";

import Link from "next/link";
import type { ingressoItf } from "../types/ingressoItf";
import { IngressoCardCompact } from "@/components/ingresso/IngressoCard";

// Mock de ingressos para testes locais
const mockIngressos: ingressoItf[] = [
  {
    id: "1",
    torcedorId: "user-123",
    jogoId: "jogo-001",
    loteId: "lote-001",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INGRESSO-001",
    valor: "150.00",
    status: "VALIDO",
    criadoEm: "2025-01-15T10:30:00Z",
    usadoEm: null,
    atualizadoEm: "2025-01-15T10:30:00Z",
    pagamentoId: "pag-001",
    jogo: {
      id: "jogo-001",
      mandante: "Cruzeiro",
      visitante: "Atlético Mineiro",
      dataHora: "2025-02-01T20:00:00Z",
      estadio: "Mineirão",
    },
    lote: {
      id: "lote-001",
      nome: "Portaria F",
      setor: "Setor azul",
      descricao: "Acesso pela Portaria F",
    },
  },
  {
    id: "2",
    torcedorId: "user-123",
    jogoId: "jogo-002",
    loteId: "lote-002",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INGRESSO-002",
    valor: "120.00",
    status: "USADO",
    criadoEm: "2024-12-20T15:45:00Z",
    usadoEm: "2025-01-10T19:30:00Z",
    atualizadoEm: "2025-01-10T19:30:00Z",
    pagamentoId: "pag-002",
    jogo: {
      id: "jogo-002",
      mandante: "Cruzeiro",
      visitante: "Flamengo",
      dataHora: "2025-01-10T19:00:00Z",
      estadio: "Mineirão",
    },
    lote: {
      id: "lote-002",
      nome: "Portaria E",
      setor: "Setor azul",
      descricao: "Acesso pela Portaria E",
    },
  },
  {
    id: "3",
    torcedorId: "user-123",
    jogoId: "jogo-003",
    loteId: "lote-003",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INGRESSO-003",
    valor: "180.00",
    status: "CANCELADO",
    criadoEm: "2024-11-10T08:15:00Z",
    usadoEm: null,
    atualizadoEm: "2024-11-25T14:20:00Z",
    pagamentoId: "pag-003",
    jogo: {
      id: "jogo-003",
      mandante: "Cruzeiro",
      visitante: "Grêmio",
      dataHora: "2024-12-05T18:00:00Z",
      estadio: "Mineirão",
    },
    lote: {
      id: "lote-003",
      nome: "Portaria D",
      setor: "Setor azul",
      descricao: "Acesso pela Portaria D",
    },
  },
];

export default function IngressosPage() {
  const agora = new Date();

  const proximos = mockIngressos.filter((ing) => {
    const dataJogo = ing.jogo?.dataHora ? new Date(ing.jogo.dataHora) : null;
    return dataJogo && dataJogo >= agora && ing.status === "VALIDO";
  });

  const anteriores = mockIngressos.filter((ing) => {
    const dataJogo = ing.jogo?.dataHora ? new Date(ing.jogo.dataHora) : null;
    return !dataJogo || dataJogo < agora || ing.status !== "VALIDO";
  });

  const naoTemIngresso = mockIngressos.length === 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            Meus Ingressos
          </h1>
          <p className="text-sm text-muted-foreground">
            Veja seus ingressos ativos e o histórico de jogos já utilizados.
          </p>
        </header>

        {naoTemIngresso && (
          <div className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
            Você ainda não possui ingressos. Quando comprar um, ele vai
            aparecer aqui. 🎟️
          </div>
        )}

        {!naoTemIngresso && (
          <div className="space-y-6">
            {/* Próximos jogos / ingressos válidos */}
            {proximos.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Próximos jogos
                </h2>
                <div className="space-y-3">
                  {proximos.map((ingresso) => (
                    <Link
                      key={ingresso.id}
                      href={`/ingressos/${ingresso.id}`}
                      className="block"
                    >
                      <IngressoCardCompact ingresso={ingresso} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Histórico / usados / cancelados */}
            {anteriores.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Histórico
                </h2>
                <div className="space-y-3">
                  {anteriores.map((ingresso) => (
                    <Link
                      key={ingresso.id}
                      href={`/ingressos/${ingresso.id}`}
                      className="block"
                    >
                      <IngressoCardCompact ingresso={ingresso} />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
