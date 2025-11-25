"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation"; // ← ADICIONE ISSO
import { AbaIngressosJogo } from "@/components/admin/jogos/detalhe/AbaIngresso";
import { AbaSetoresJogo } from "@/components/admin/jogos/detalhe/AbaSetoresJogo";
import type { JogoLote } from "@/components/admin/jogos/detalhe/DialogCriarLoteJogo";
import { AbaLotesJogo } from "@/components/admin/jogos/detalhe/AbaLotes";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type SetorBase = {
  id: string;
  nome: string;
  capacidade: number;
};

export type JogoSetor = {
  id: string;
  jogoId: string;
  setorId: string;
  capacidade: number;
  aberto: boolean;
  tipo: string;
  setor: SetorBase;
};

type TorcedorBase = {
  id: string;
  nome: string;
};

type LoteBase = {
  id: string;
  nome: string;
};

export type Ingresso = {
  id: string;
  qrCode: string;
  status: string;
  socio: TorcedorBase | null;
  lote: LoteBase | null;
};

type Jogo = {
  setores: JogoSetor[];
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao: string | null;
};

type JogoFullResponse = Jogo & {
  setores: JogoSetor[];
  lotes: JogoLote[];
  ingressos: Ingresso[];
};

type RouteParams = {
  id: string;
};

export default function PageDetalheJogo() {
  const { id } = useParams<RouteParams>();

  const [activeTab, setActiveTab] = useState("sectors");
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [setores, setSetores] = useState<JogoSetor[]>([]);
  const [lotes, setLotes] = useState<JogoLote[]>([]);
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        const req = await fetch(`${API}/admin/jogo/${id}/full`);

        if (!req.ok) {
          throw new Error("Erro ao carregar jogo");
        }

        const data: JogoFullResponse = await req.json();

        setJogo({
          id: data.id,
          nome: data.nome,
          data: data.data,
          local: data.local,
          descricao: data.descricao,
          setores: data.setores,
        });

        setSetores(data.setores);
        setLotes(data.lotes);
        setIngressos(data.ingressos);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [id]);

  if (loading || !jogo) {
    return <p className="text-center py-10">Carregando...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{jogo.nome}</h1>
        <p className="text-muted-foreground">
          {new Date(jogo.data).toLocaleDateString("pt-BR")} • {jogo.local}
        </p>
        {jogo.descricao && (
          <p className="mt-1 text-sm text-muted-foreground">{jogo.descricao}</p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="sectors">Setores</TabsTrigger>
          <TabsTrigger value="lots">Lotes</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
        </TabsList>

        <TabsContent value="sectors">
          <AbaSetoresJogo
            jogoId={jogo.id}
            setores={setores}
            onSetoresChange={setSetores}
          />
        </TabsContent>

        <TabsContent value="lots">
          <AbaLotesJogo
            jogoId={jogo.id}
            lotes={lotes}
            setores={setores}
            onLotesChange={setLotes}
          />
        </TabsContent>

        <TabsContent value="tickets">
          <AbaIngressosJogo ingressos={ingressos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
