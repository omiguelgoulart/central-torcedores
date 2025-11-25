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

type PeriodicidadePlano = "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL";
type StatusAssinaturaApi = "ATIVA" | "CANCELADA" | "SUSPENSA" | "EXPIRADA";
type StatusFaturaApi = "ABERTA" | "PAGA" | "ATRASADA" | "CANCELADA";

interface ApiFatura {
  id: string;
  competencia: string;
  valor: number | string;
  status: StatusFaturaApi;
  vencimentoEm: string;
}

interface ApiPlano {
  id: string;
  nome: string;
  descricao?: string | null;
  valor?: number | string | null;
  periodicidade?: PeriodicidadePlano | null;
}

interface ApiAssinatura {
  id: string;
  status: StatusAssinaturaApi;
  inicioEm?: string | null;
  proximaCobrancaEm?: string | null;
  valorAtual?: number | string | null;
  periodicidade?: PeriodicidadePlano | null;
  plano?: ApiPlano | null;
  faturas?: ApiFatura[];
}

interface UsuarioResponse {
  id: string;
  nome: string;
  matricula: string;
  numeroCartao?: string | null;
  assinaturas?: ApiAssinatura[];
}

interface AssociacaoData {
  planoId: string | null;
  planoNome: string | null;
  descricao?: string | null;
  status: "ATIVA" | "PENDENTE" | "CANCELADA" | "SEM_PLANO";
  valor: number | null;
  periodicidade: PeriodicidadePlano | null;
  dataInicio?: string | null;
  proximaCobranca?: string | null;
  matricula: string;
  numeroCartao?: string | null;
  nomeSocio: string;
}

type AuthCookieUser = { id?: string };
type AuthCookie = { id?: string; user?: AuthCookieUser };

function getTorcedorIdFromCookies(): string | null {
  const direto = Cookies.get("usuarioId");
  if (direto) return direto;

  const auth = Cookies.get("auth");
  if (!auth) return null;

  try {
    const parsed: AuthCookie = JSON.parse(auth);
    return parsed.user?.id ?? parsed.id ?? null;
  } catch {
    return null;
  }
}

export default function AssociacaoPage() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [associacao, setAssociacao] = useState<AssociacaoData | null>(null);
  const [parcelas, setParcelas] = useState<ParcelaRegistro[]>([]);

  useEffect(() => {
    async function fetchAssociacao() {
      try {
        const torcedorId = getTorcedorIdFromCookies();

        if (!torcedorId) {
          setErro("Usuário não encontrado.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/id/${torcedorId}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }

        const data = (await response.json()) as UsuarioResponse;

        const assinaturas = data.assinaturas ?? [];
        const assinaturaAtiva =
          assinaturas.find((a) => a.status === "ATIVA") ?? null;

        const plano = assinaturaAtiva?.plano ?? null;
        const faturas = assinaturaAtiva?.faturas ?? [];

        const parcelasConvertidas: ParcelaRegistro[] = faturas.map((f) => {
          let statusParcela: ParcelaRegistro["status"] = "A_VENCER";

          if (f.status === "PAGA") statusParcela = "PAGO";

          return {
            id: f.id,
            numeroParcela: f.competencia,
            dataVencimento: f.vencimentoEm,
            valor: typeof f.valor === "string" ? Number(f.valor) : f.valor,
            status: statusParcela,
          };
        });

        const statusAssociacao =
          assinaturaAtiva?.status === "ATIVA"
            ? "ATIVA"
            : assinaturaAtiva?.status === "CANCELADA"
            ? "CANCELADA"
            : assinaturaAtiva
            ? "PENDENTE"
            : "SEM_PLANO";

        setAssociacao({
          planoId: plano?.id ?? null,
          planoNome: plano?.nome ?? null,
          descricao: plano?.descricao ?? null,
          status: statusAssociacao,
          valor:
            assinaturaAtiva?.valorAtual != null
              ? Number(assinaturaAtiva.valorAtual)
              : plano?.valor != null
              ? Number(plano.valor)
              : null,
          periodicidade:
            assinaturaAtiva?.periodicidade ??
            plano?.periodicidade ??
            null,
          dataInicio: assinaturaAtiva?.inicioEm ?? null,
          proximaCobranca: assinaturaAtiva?.proximaCobrancaEm ?? null,
          matricula: data.matricula,
          numeroCartao: data.numeroCartao ?? null,
          nomeSocio: data.nome,
        });

        setParcelas(parcelasConvertidas);
      } catch {
        setErro("Erro ao carregar informações da associação.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssociacao();
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
          className="relative w-full h-[220px] sm:h-[260px] bg-center bg-cover flex items-center justify-center"
          style={{
            backgroundImage: "url('/fundoPartidas.jpeg')",
          }}
        />
        <div className="p-4 space-y-3">
          <div>
          <h1 className="text-3xl font-bold">Minha Associação</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Informações sobre sua assinatura
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="px-6 py-12 text-center">
            <p className="text-zinc-400">
              Você ainda não possui um plano ativo.
            </p>
            <p className="text-zinc-500 text-sm mt-2">
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
        className="relative w-full h-[220px] sm:h-[260px] bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: "url('/fundoPartidas.jpeg')",
        }}
      />
      <div className="space-y-8 p-4">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl font-bold">Minha Associação</h1>
        </div>

        <div className="flex gap-2 flex-col md:flex-row items-center justify-between">
          <div className="flex-shrink-0 md:w-1/3">
            <CarteirinhaSocio
              nome={associacao.nomeSocio}
              matricula={associacao.matricula}
              planoNome={associacao.planoNome ?? ""}
              numeroCartao={associacao.numeroCartao ?? undefined}
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
