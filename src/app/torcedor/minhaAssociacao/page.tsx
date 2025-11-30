"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { Card, CardContent } from "@/components/ui/card";
import { CarteirinhaSocio } from "@/components/torcedor/minhaAssociacao/CarteirinhaSocio";
import { ParcelaRegistro, TabelaPagamentosSocio } from "@/components/torcedor/minhaAssociacao/TablePagamento";
import { CardResumo } from "@/components/torcedor/minhaAssociacao/CardResumo";
import { ApiAssinatura, AssociacaoData, UsuarioResponse } from "@/app/types/associacao";


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

function selecionarAssinaturaAtiva(assinaturas: ApiAssinatura[]): ApiAssinatura | null {
  if (!assinaturas.length) return null;

  // prioriza ATIVA, depois o resto
  const ativa = assinaturas.find((a) => a.status === "ATIVA");
  if (ativa) return ativa;

  // se não tiver ATIVA, pega a mais recente
  return [...assinaturas].sort((a, b) => {
    const da = a.inicioEm ? new Date(a.inicioEm).getTime() : 0;
    const db = b.inicioEm ? new Date(b.inicioEm).getTime() : 0;
    return db - da;
  })[0];
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

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/usuario/id/${torcedorId}`,
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }

        const data = (await response.json()) as UsuarioResponse;

        const assinaturas = data.assinaturas ?? [];
        const assinaturaSelecionada = selecionarAssinaturaAtiva(assinaturas);
        const plano = assinaturaSelecionada?.plano ?? null;
        const faturas = assinaturaSelecionada?.faturas ?? [];

        const hoje = new Date();

        const parcelasConvertidas: ParcelaRegistro[] = faturas.map((f) => {
          const valorParcela =
            typeof f.valor === "string" ? Number(f.valor) : f.valor;

          // status padrão da UI
          let statusParcela: ParcelaRegistro["status"] = "A_VENCER";

          if (f.status === "PAGA") {
            statusParcela = "PAGO";
          } else {
            const vencimento = new Date(f.vencimentoEm);
            if (vencimento < hoje && f.status !== "CANCELADA") {
              // vencido e não cancelado -> continua "A_VENCER" ou "ATRASADO"
              // se no enum de ParcelaRegistro existir "ATRASADO", pode trocar aqui
              statusParcela = "A_VENCER";
            }
          }

          return {
            id: f.id,
            numeroParcela: f.competencia,
            dataVencimento: f.vencimentoEm,
            valor: valorParcela,
            status: statusParcela,
          };
        });

        const statusAssociacao =
          assinaturaSelecionada?.status === "ATIVA"
            ? "ATIVA"
            : assinaturaSelecionada?.status === "CANCELADA"
            ? "CANCELADA"
            : assinaturaSelecionada
            ? "PENDENTE"
            : "SEM_PLANO";

        const valorPlano =
          assinaturaSelecionada?.valorAtual != null
            ? Number(assinaturaSelecionada.valorAtual)
            : plano?.valor != null
            ? Number(plano.valor)
            : null;

        setAssociacao({
          planoId: plano?.id ?? null,
          planoNome: plano?.nome ?? null,
          descricao: plano?.descricao ?? null,
          status: statusAssociacao,
          valor: valorPlano,
          periodicidade:
            assinaturaSelecionada?.periodicidade ??
            plano?.periodicidade ??
            null,
          dataInicio: assinaturaSelecionada?.inicioEm ?? null,
          proximaCobranca: assinaturaSelecionada?.proximaCobrancaEm ?? null,
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

    void fetchAssociacao();
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
