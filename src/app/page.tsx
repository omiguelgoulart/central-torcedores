"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ClubeFooter } from "@/components/home/ClubeFooter";
import { FaixaDeJogos } from "@/components/home/FaixaDeJogo";
import { Perguntas } from "@/components/home/Perguntas";
import { PlanosCampanha } from "@/components/home/PlanosCampanha";
import { Button } from "@/components/ui/button";

const API =
  process.env.NEXT_PUBLIC_API_URL ?? "https://central-api-jet.vercel.app";

interface JogoAPI {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao: string | null;
  hasLotes?: boolean;
}

interface JogoHome {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao: string;
  hasLotes: boolean;
}

interface PlanoAPI {
  id: string;
  nome: string;
  descricao: string | null;
  valor: string;
  periodicidade: string;
  isFeatured: boolean | null;
  badgeLabel: string | null;
  beneficios: {
    id: string;
    titulo: string;
    descricao: string | null;
  }[];
}

interface PlanoHome {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  periodicidade: string;
  destaque: boolean;
  rotuloBadge?: string;
  beneficios: string[];
}

export default function HomePage() {
  const router = useRouter();

  const [jogos, setJogos] = useState<JogoHome[]>([]);
  const [planos, setPlanos] = useState<PlanoHome[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const jogosRes = await fetch(`${API}/admin/jogo`, {
          cache: "no-store",
        });
        const planosRes = await fetch(`${API}/planos`, { cache: "no-store" });

        const jogosJson: JogoAPI[] = await jogosRes.json();
        const planosJson: PlanoAPI[] = await planosRes.json();

        const jogosFormatados: JogoHome[] = jogosJson.map((j) => ({
          id: j.id,
          nome: j.nome,
          data: j.data,
          local: j.local,
          descricao: j.descricao ?? "",
          hasLotes: true, // temporário até integrar com backend dos lotes
        }));

        const planosFormatados: PlanoHome[] = planosJson.map((p) => ({
          id: p.id,
          nome: p.nome,
          descricao: p.descricao ?? "",
          valor: Number(p.valor),
          periodicidade: p.periodicidade,
          destaque: p.isFeatured ?? false,
          rotuloBadge: p.badgeLabel ?? undefined,
          beneficios: p.beneficios?.map((b) => b.titulo) ?? [],
        }));

        setJogos(jogosFormatados);
        setPlanos(planosFormatados);
      } catch (e) {
        console.error("Erro ao carregar home:", e);
      } finally {
        setCarregando(false);
      }
    };

    void carregar();
  }, []);

  const faqs = [
    {
      pergunta: "Como compro meia-entrada?",
      resposta: "Selecione a opção e apresente documento na entrada.",
    },
    {
      pergunta: "Posso transferir ingresso?",
      resposta: "Em breve. No momento, o ingresso é pessoal.",
    },
    {
      pergunta: "Como troco de plano?",
      resposta: "Acesse sua conta e vá em Assinatura > Trocar Plano.",
    },
    {
      pergunta: "Quais formas de pagamento?",
      resposta: "Aceitamos cartão, boleto e PIX.",
    },
  ];

  const proximoJogo = jogos.at(0);

  // 🔒 Enquanto estiver carregando, mostra só a tela de loading
  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Carregando informações da Central de Torcedores...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* HERO */}
        <section className="relative w-full h-[320px] rounded-b-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/football-stadium-crowd.jpg"
              alt="Estádio"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 px-4 py-8 flex flex-col justify-end h-full space-y-3">
            <h1 className="text-2xl font-bold text-white drop-shadow">
              {proximoJogo?.nome ?? "Confira os próximos jogos na Baixada"}
            </h1>

            <p className="text-sm text-white/90 drop-shadow">
              {proximoJogo?.descricao ??
                "Garanta seu ingresso com antecedência."}
            </p>

            <div className="flex gap-2 mt-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/planos")}
              >
                Ver planos de sócio
              </Button>

              <Button size="lg" onClick={() => router.push("/partidas")}>
                Comprar ingresso
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 pt-12 space-y-14 pb-20">
          {jogos.length > 0 && <FaixaDeJogos jogos={jogos} />}

          {planos.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Planos de sócio</h2>
              <PlanosCampanha planos={planos} />
            </section>
          )}

          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Dúvidas frequentes</h2>
            <Perguntas perguntas={faqs} />
          </section>
        </div>
      </main>

      <ClubeFooter />
    </div>
  );
}
