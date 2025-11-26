"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Jogo } from "@/components/partidas/CardJogo";
import { FiltroJogos } from "@/components/admin/jogos/FiltroJogos";
import { TabelaJogos } from "@/components/admin/jogos/TabelaJogo";
import { DialogNovoJogo } from "@/components/admin/jogos/DialogNovoJogo";
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export default function PageJogos() {
  const [termoBusca, setTermoBusca] = useState("");
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregarJogos() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API}/admin/jogo`);
      if (!res.ok) throw new Error();

      const data: Jogo[] = await res.json();
      setJogos(data);
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
    if (!termo) return jogos;

    return jogos.filter((j) => {
      return (
        j.nome.toLowerCase().includes(termo) ||
        new Date(j.data).toLocaleDateString("pt-BR").includes(termo) ||
        j.local.toLowerCase().includes(termo)
      );
    });
  }, [jogos, termoBusca]);

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
          <FiltroJogos termoBusca={termoBusca} onChangeBusca={setTermoBusca} />
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
