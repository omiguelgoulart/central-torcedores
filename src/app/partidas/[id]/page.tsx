"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ExibicaoMapaSetor,
  ValorSetor,
} from "@/components/partidas/detalhe/ExibicaoMapaSetor";
import { PartidaHeader } from "@/components/partidas/detalhe/HeaderPartida";
import { JogoItf } from "@/app/types/jogoItf";
import useJogo from "@/hooks/useJogo";

type PageProps = {
  params: {
    id: string;
  };
};

type BoxMapa = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const BOXES_POR_SLUG: Record<string, BoxMapa> = {
  jk: { left: 18, top: 17, width: 60, height: 12 },
  social: { left: 18, top: 72, width: 60, height: 10 },
  cativas: { left: 60.5, top: 82, width: 18, height: 8 },
  norte: { left: 12, top: 30, width: 10, height: 45 },
  "norte-visitante": { left: 12, top: 30, width: 10, height: 45 },
  sul: { left: 75, top: 32, width: 10, height: 45 },
};

function getBoxPorSlug(slug?: string): BoxMapa {
  const defaultBox: BoxMapa = { left: 0, top: 0, width: 0, height: 0 };

  if (!slug) {
    return defaultBox;
  }

  const box = BOXES_POR_SLUG[slug as keyof typeof BOXES_POR_SLUG];
  return box ?? defaultBox;
}

export default function PartidaDetalhePage({ params }: PageProps) {
  const routeParams = useParams<{ id?: string | string[] }>();

  const id =
    typeof routeParams?.id === "string"
      ? routeParams.id
      : Array.isArray(routeParams?.id)
        ? routeParams.id[0]
        : params?.id;

  const { fetchJogosById } = useJogo();
  const [jogo, setJogo] = useState<JogoItf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID da partida não informado na rota.");
      setJogo(null);
      return;
    }

    let ativo = true;

    const fetchJogo = async () => {
      setLoading(true);
      setError(null);

      const jogoPorId = await fetchJogosById(id);

      if (!ativo) return;

      if (!jogoPorId) {
        setError("Não foi possível carregar a partida.");
        setJogo(null);
      } else {
        setJogo(jogoPorId);
      }

      setLoading(false);
    };

    fetchJogo();

    return () => {
      ativo = false;
    };
  }, [id, fetchJogosById]);

  const valores = useMemo<ValorSetor[]>(() => {
    if (!jogo) return [];

    return (jogo.setores ?? []).map((jogoSetor) => {
      const lotesDoSetor = (jogo.lotes ?? []).filter(
        (lote) => lote.jogoSetorId === jogoSetor.id,
      );

      const lotes = lotesDoSetor.map((lote) => {
        const quantidade = lote.quantidade ?? jogoSetor.capacidade;
        const preco =
          typeof lote.precoUnitario === "string"
            ? parseFloat(lote.precoUnitario)
            : Number(lote.precoUnitario ?? 0);

        return {
          id: lote.id,
          nome: lote.nome ?? "Lote",
          preco: Number.isFinite(preco) ? preco : 0,
          quantidade,
          disponibilidade: quantidade,
          tipo: lote.tipo ?? "GERAL",
          inicioVendas: lote.inicioVendas ?? null,
          fimVendas: lote.fimVendas ?? null,
          limitePorCPF: lote.limitePorCPF ?? null,
        };
      });

      const menorPreco =
        lotes.length > 0 ? Math.min(...lotes.map((lote) => lote.preco)) : 0;

      const primeiroLote = lotes[0];
      const slug = jogoSetor.setor?.slug ?? jogoSetor.id;

      return {
        id: slug,
        nome: jogoSetor.setor?.nome ?? "Setor",
        preco: Number.isFinite(menorPreco) ? menorPreco : 0,
        capacidade: jogoSetor.capacidade,
        disponibilidade: jogoSetor.capacidade,
        setorId: jogoSetor.setorId,
        jogoSetorId: jogoSetor.id,
        loteId: primeiroLote?.id ?? "",
        aberto: jogoSetor.aberto,
        box: getBoxPorSlug(jogoSetor.setor?.slug),
        lotes,
      };
    });
  }, [jogo]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-sm text-muted-foreground">Carregando partida...</p>
      </div>
    );
  }

  if (error || !jogo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-sm text-muted-foreground">
          {error ?? "Partida não encontrada."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <PartidaHeader
        partida={{
          id: jogo.id,
          nome: jogo.nome,
          data: jogo.data,
          local: jogo.local,
        }}
      />

      <ExibicaoMapaSetor jogoId={jogo.id} valores={valores} />
    </div>
  );
}
