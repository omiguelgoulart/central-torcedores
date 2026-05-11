"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Jogo } from "@/components/partidas/CardJogo";
import { FiltroJogos } from "@/components/admin/jogos/FiltroJogos";
import { TabelaJogos } from "@/components/admin/jogos/TabelaJogo";
import { DialogNovoJogo } from "@/components/admin/jogos/DialogNovoJogo";
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb";
import { useAdminJogo } from "@/hooks/useAdminJogo";

export default function PageJogos() {
  const [termoBusca, setTermoBusca] = useState("");
  const [periodo, setPeriodo] = useState("todos");
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchJogos } = useAdminJogo();

  async function carregarJogos() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJogos<Jogo[]>();
      setJogos(Array.isArray(data) ? data : []);
    } catch {
      setError("Não foi possível carregar os jogos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarJogos();
  }, []);

  const jogosFiltrados = useMemo(() => {
    const termo = termoBusca.toLowerCase().trim();
    const agora = new Date().getTime();
    const limite = periodo !== "todos" ? agora + Number(periodo) * 24 * 60 * 60 * 1000 : null;

    return jogos.filter((j) => {
      const bateTexto =
        !termo ||
        j.nome.toLowerCase().includes(termo) ||
        new Date(j.data).toLocaleDateString("pt-BR").includes(termo) ||
        j.local.toLowerCase().includes(termo);

      const jogoTs = new Date(j.data).getTime();
      const batePeriodo = !limite || (jogoTs >= agora && jogoTs <= limite);

      return bateTexto && batePeriodo;
    });
  }, [jogos, termoBusca, periodo]);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Jogos", href: "/admin/jogos" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jogos</h1>
          <p className="text-muted-foreground">Gerenciar eventos e lotes</p>
        </div>

        <DialogNovoJogo onCreated={carregarJogos} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <FiltroJogos
            termoBusca={termoBusca}
            onChangeBusca={setTermoBusca}
            periodo={periodo}
            onChangePeriodo={setPeriodo}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Jogos</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">
              Carregando jogos...
            </p>
          ) : error ? (
            <p className="text-center py-8 text-destructive">{error}</p>
          ) : jogosFiltrados.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Nenhum jogo encontrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <TabelaJogos
                jogos={jogosFiltrados}
                onDelete={(id) =>
                  setJogos((prev) => prev.filter((j) => j.id !== id))
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
