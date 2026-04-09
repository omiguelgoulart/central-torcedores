"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { Card, CardContent } from "@/components/ui/card";
import { CarteirinhaSocio } from "@/components/torcedor/minhaAssociacao/CarteirinhaSocio";
import {
  ParcelaRegistro,
  TabelaPagamentosSocio,
} from "@/components/torcedor/minhaAssociacao/TablePagamento";
import { CardResumo } from "@/components/torcedor/minhaAssociacao/CardResumo";
import {
  ApiAssinatura,
  AssociacaoData,
  UsuarioResponse,
} from "@/app/types/assinaturaItf";

type AuthCookieUser = {
  id?: string;
};

type AuthCookie = {
  id?: string;
  user?: AuthCookieUser;
};

function getTorcedorIdFromCookies(): string | null {
  const usuarioId = Cookies.get("usuarioId");
  if (usuarioId) return usuarioId;

  const auth = Cookies.get("auth");
  if (!auth) return null;

  try {
    const parsed = JSON.parse(auth) as AuthCookie;
    return parsed.user?.id ?? parsed.id ?? null;
  } catch {
    return null;
  }
}

function selecionarAssinaturaPrincipal(
  assinaturas: ApiAssinatura[],
): ApiAssinatura | null {
  if (!assinaturas.length) return null;

  const assinaturaAtiva = assinaturas.find(
    (assinatura) => assinatura.status === "ATIVA",
  );
  if (assinaturaAtiva) return assinaturaAtiva;

  return [...assinaturas].sort((a, b) => {
    const dataA = a.inicioEm ? new Date(a.inicioEm).getTime() : 0;
    const dataB = b.inicioEm ? new Date(b.inicioEm).getTime() : 0;
    return dataB - dataA;
  })[0];
}

function mapearParcelas(assinatura: ApiAssinatura | null): ParcelaRegistro[] {
  if (!assinatura?.faturas?.length) return [];

  const hoje = new Date();

  return assinatura.faturas.map((fatura) => {
    const valor =
      typeof fatura.valor === "string" ? Number(fatura.valor) : fatura.valor;

    let status: ParcelaRegistro["status"] = "A_VENCER";

    if (fatura.status === "PAGA") {
      status = "PAGO";
    } else if (fatura.status === "CANCELADA") {
      status = "A_VENCER";
    } else {
      const vencimento = new Date(fatura.vencimentoEm);
      if (vencimento < hoje) {
        status = "A_VENCER";
      }
    }

    return {
      id: fatura.id,
      numeroParcela: fatura.competencia,
      dataVencimento: fatura.vencimentoEm,
      valor,
      status,
    };
  });
}

function montarAssociacao(
  data: UsuarioResponse,
  assinatura: ApiAssinatura | null,
): AssociacaoData {
  const plano = assinatura?.plano ?? null;

  const status: AssociacaoData["status"] =
    assinatura?.status === "ATIVA"
      ? "ATIVA"
      : assinatura?.status === "CANCELADA"
        ? "CANCELADA"
        : assinatura
          ? "PENDENTE"
          : "SEM_PLANO";

  const valor =
    assinatura?.valorAtual != null
      ? Number(assinatura.valorAtual)
      : plano?.valor != null
        ? Number(plano.valor)
        : null;

  return {
    planoId: plano?.id ?? null,
    planoNome: plano?.nome ?? null,
    descricao: plano?.descricao ?? null,
    status,
    valor,
    periodicidade: assinatura?.periodicidade ?? plano?.periodicidade ?? null,
    dataInicio: assinatura?.inicioEm ?? null,
    proximaCobranca: assinatura?.proximaCobrancaEm ?? null,
    matricula: data.matricula,
    numeroCartao: data.numeroCartao ?? null,
    nomeSocio: data.nome,
    fotoUrl: data.fotoUrl ?? null,
  };
}

async function buscarAssociacaoDoTorcedor(torcedorId: string): Promise<{
  associacao: AssociacaoData;
  parcelas: ParcelaRegistro[];
}> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/usuario/id/${torcedorId}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar dados da associação");
  }

  const data = (await response.json()) as UsuarioResponse;
  const assinaturaSelecionada = selecionarAssinaturaPrincipal(
    data.assinaturas ?? [],
  );

  return {
    associacao: montarAssociacao(data, assinaturaSelecionada),
    parcelas: mapearParcelas(assinaturaSelecionada),
  };
}

export default function AssociacaoPage() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [associacao, setAssociacao] = useState<AssociacaoData | null>(null);
  const [parcelas, setParcelas] = useState<ParcelaRegistro[]>([]);

  useEffect(() => {
    async function carregarPagina() {
      try {
        setLoading(true);
        setErro(null);

        const torcedorId = getTorcedorIdFromCookies();

        if (!torcedorId) {
          setErro("Usuário não encontrado.");
          return;
        }

        const resultado = await buscarAssociacaoDoTorcedor(torcedorId);

        setAssociacao(resultado.associacao);
        setParcelas(resultado.parcelas);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar informações da associação.");
      } finally {
        setLoading(false);
      }
    }

    void carregarPagina();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Carregando suas informações...
      </div>
    );
  }

  if (erro || !associacao) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        {erro || "Erro ao carregar dados."}
      </div>
    );
  }

  if (associacao.status === "SEM_PLANO") {
    return (
      <div className="space-y-6">
        <section
          className="relative h-[220px] w-full bg-cover bg-center sm:h-[260px] flex items-center justify-center"
          style={{ backgroundImage: "url('/fundoPartidas.jpeg')" }}
        />
        <div className="space-y-3 p-4">
          <div>
            <h1 className="text-3xl font-bold">Minha Associação</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Informações sobre sua assinatura
            </p>
          </div>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="px-6 py-12 text-center">
              <p className="text-zinc-400">
                Você ainda não possui um plano ativo.
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Acesse a página de planos para escolher o melhor para você.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section
        className="relative h-[220px] w-full bg-cover bg-center sm:h-[260px] flex items-center justify-center"
        style={{ backgroundImage: "url('/fundoPartidas.jpeg')" }}
      />
      <div className="space-y-8 p-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold">Minha Associação</h1>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <div className="flex-shrink-0 md:w-1/3">
            <CarteirinhaSocio
              nome={associacao.nomeSocio}
              matricula={associacao.matricula}
              planoNome={associacao.planoNome ?? ""}
              numeroCartao={associacao.numeroCartao ?? undefined}
              fotoUrl={associacao.fotoUrl ?? undefined}
            />
          </div>

          <div className="md:w-2/3">
            <CardResumo associacao={associacao} />
          </div>
        </div>

        <TabelaPagamentosSocio parcelas={parcelas} />
      </div>
    </div>
  );
}
