"use client";

import { useEffect, useState } from "react";
import { ingressoItf } from "@/app/types/ingressoItf";
import { Chevron } from "@/components/torcedor/meusIngressos/ChevronIngresso";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CardIngresso } from "@/components/torcedor/meusIngressos/CardIngresso";
import Link from "next/link";
import {
  AbaIngresso,
  TabsIngresso,
} from "@/components/torcedor/meusIngressos/TabsIngressos";
import Cookies from "js-cookie";

type AuthCookieUser = {
  id?: string;
};

type AuthCookie = {
  id?: string;
  nome?: string;
  email?: string;
  cpf?: string;
  token?: string;
  user?: AuthCookieUser;
};

function getTorcedorIdFromCookies(): string | null {
  const direto = Cookies.get("usuarioId");
  if (direto) {
    console.log("usuarioId direto do cookie:", direto);
    return direto;
  }

  const auth = Cookies.get("auth");
  console.log("cookie auth bruto:", auth);
  if (!auth) return null;

  try {
    const parsed = JSON.parse(auth) as AuthCookie;
    console.log("auth parseado:", parsed);
    const id = parsed.user?.id ?? parsed.id ?? null;
    console.log("id extraído do auth:", id);
    return id ?? null;
  } catch (err) {
    console.error("Erro ao parsear cookie auth:", err);
    return null;
  }
}

export default function IngressosPage() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [ingressos, setIngressos] = useState<ingressoItf[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<AbaIngresso>("PROXIMOS");

  useEffect(() => {
    async function fetchIngressos() {
      try {
        const torcedorId = getTorcedorIdFromCookies();

        if (!torcedorId) {
          setErro("Usuário não encontrado.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/id/${torcedorId}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar usuário");
        }

        const data = await response.json();
        console.log("Resposta do backend /usuario/:id:", data);

        setIngressos(data.ingressos ?? []);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar ingressos.");
      } finally {
        setLoading(false);
      }
    }

    fetchIngressos();
  }, []);

  const agora = new Date();

  const proximos = ingressos.filter((ing) => {
    const dataJogo = ing.jogo?.dataHora ? new Date(ing.jogo.dataHora) : null;
    return dataJogo && dataJogo >= agora && ing.status === "VALIDO";
  });

  const anteriores = ingressos.filter((ing) => {
    const dataJogo = ing.jogo?.dataHora ? new Date(ing.jogo.dataHora) : null;
    return !dataJogo || dataJogo < agora || ing.status !== "VALIDO";
  });

  const listaVisivel = abaAtiva === "PROXIMOS" ? proximos : anteriores;
  const naoTemIngresso = ingressos.length === 0;

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <p className="text-center text-muted-foreground">
          Carregando ingressos...
        </p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen px-4 py-8">
        <p className="text-center text-muted-foreground">{erro}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Meus Ingressos</h1>
        <p className="text-sm text-muted-foreground">
          Veja seus ingressos em aberto e o histórico de jogos já utilizados.
        </p>
      </header>

      <Card className="overflow-hidden rounded-2xl">
        <CardHeader className="p-0">
          <TabsIngresso active={abaAtiva} onChange={setAbaAtiva} />
        </CardHeader>

        <CardContent className="p-4">
          {naoTemIngresso && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Você ainda não possui ingressos. Quando comprar um, ele vai
              aparecer aqui.
            </div>
          )}

          {!naoTemIngresso && listaVisivel.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Nenhum ingresso nesta aba no momento.
            </div>
          )}

          {!naoTemIngresso && listaVisivel.length > 0 && (
            <ul className="space-y-4">
              {listaVisivel.map((ingresso) => (
                <li key={ingresso.id}>
                  <Link href={`/ingressos/${ingresso.id}`}>
                    <CardIngresso ingresso={ingresso} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="mt-4">
        <Chevron currentPage={1} totalPages={1} />
      </div>
    </main>
  );
}
