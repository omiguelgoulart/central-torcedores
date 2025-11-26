"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Setor, TipoSetor } from "@/components/admin/setores/types";
import { SetorResumoCards } from "@/components/admin/setores/SetorResumoCards";
import { SetorFiltros } from "@/components/admin/setores/SetorFiltros";
import { SetorTabela } from "@/components/admin/setores/SetorTabela";
import {
  SetorDialog,
  SetorFormValues,
} from "@/components/admin/setores/SetorDialog";
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type FiltroTipo = "TODOS" | TipoSetor;

export default function PaginaSetoresEstadio() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [carregando, setCarregando] = useState(false);

  const [termoBusca, setTermoBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("TODOS");

  const [dialogAberto, setDialogAberto] = useState(false);
  const [modoDialog, setModoDialog] = useState<"create" | "edit">("create");
  const [setorSelecionado, setSetorSelecionado] = useState<Setor | null>(null);

  useEffect(() => {
    async function carregarSetores() {
      try {
        setCarregando(true);
        const resposta = await fetch(`${API}/admin/setor`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!resposta.ok) {
          console.error("Falha ao buscar setores da API /admin/setor");
          return;
        }

        const dados: Setor[] = await resposta.json();
        if (Array.isArray(dados)) {
          setSetores(dados);
        }
      } catch (erro) {
        console.error("Erro ao carregar setores:", erro);
      } finally {
        setCarregando(false);
      }
    }

    void carregarSetores();
  }, []);

  const capacidadeTotal = useMemo(
    () => setores.reduce((acc, s) => acc + s.capacidade, 0),
    [setores],
  );

  const capacidadeMedia = useMemo(() => {
    if (!setores.length) return 0;
    return Math.round(capacidadeTotal / setores.length);
  }, [setores.length, capacidadeTotal]);

  const setoresFiltrados = useMemo(() => {
    return setores.filter((setor) => {
      const bateNome =
        !termoBusca ||
        setor.nome.toLowerCase().includes(termoBusca.toLowerCase());
      const bateTipo =
        filtroTipo === "TODOS" ? true : setor.tipo === filtroTipo;

      return bateNome && bateTipo;
    });
  }, [setores, termoBusca, filtroTipo]);

  function handleAbrirCriacao() {
    setModoDialog("create");
    setSetorSelecionado(null);
    setDialogAberto(true);
  }

  function handleAbrirEdicao(setor: Setor) {
    setModoDialog("edit");
    setSetorSelecionado(setor);
    setDialogAberto(true);
  }

  function handleExcluirSetor(id: number) {
    void (async () => {
      try {
        setCarregando(true);

        const res = await fetch(`${API}/admin/setor/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error ?? "Erro ao excluir setor");
        }

        setSetores((prev) => prev.filter((s) => s.id !== id));
      } catch (erro) {
        console.error("Erro ao excluir setor:", erro);
      } finally {
        setCarregando(false);
      }
    })();
  }

  function handleSalvarSetor(values: SetorFormValues) {
    void (async () => {
      try {
        setCarregando(true);

        if (modoDialog === "edit" && setorSelecionado) {
          const res = await fetch(
            `${API}/admin/setor/${setorSelecionado.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nome: values.nome,
                capacidade: values.capacidade,
                tipo: values.tipo,
              }),
            },
          );

          if (!res.ok) {
            const body = (await res.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(body?.error ?? "Erro ao atualizar setor");
          }

          const atualizado: Setor = await res.json();

          setSetores((prev) =>
            prev.map((s) => (s.id === atualizado.id ? atualizado : s)),
          );
        } else {
          const res = await fetch(`${API}/admin/setor`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome: values.nome,
              capacidade: values.capacidade,
              tipo: values.tipo,
            }),
          });

          if (!res.ok) {
            const body = (await res.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(body?.error ?? "Erro ao criar setor");
          }

          const criado: Setor = await res.json();
          setSetores((prev) => [...prev, criado]);
        }

        setSetorSelecionado(null);
        setDialogAberto(false);
      } catch (erro) {
        console.error("Erro ao salvar setor:", erro);
      } finally {
        setCarregando(false);
      }
    })();
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogAberto(open);
    if (!open) {
      setSetorSelecionado(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Setores do Estádio", href: "/admin/estadio/setores" },
        ]}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Setores do Estádio
          </h1>
          <p className="text-muted-foreground">
            Gerencie capacidade, tipos e distribuição dos setores do estádio.
          </p>
        </div>

        <Button className="gap-2" onClick={handleAbrirCriacao}>
          Novo Setor
        </Button>
      </div>

      <SetorDialog
        open={dialogAberto}
        onOpenChange={handleDialogOpenChange}
        modo={modoDialog}
        setor={setorSelecionado}
        onSalvar={handleSalvarSetor}
      />

      <SetorResumoCards
        totalSetores={setores.length}
        capacidadeTotal={capacidadeTotal}
        capacidadeMedia={capacidadeMedia}
        carregando={carregando}
      />

      <Card>
        <div className="pt-6 px-6 pb-2">
          <SetorFiltros
            termoBusca={termoBusca}
            onChangeTermoBusca={setTermoBusca}
            filtroTipo={filtroTipo}
            onChangeFiltroTipo={setFiltroTipo}
          />
        </div>
      </Card>

      <SetorTabela
        setores={setoresFiltrados}
        capacidadeTotal={capacidadeTotal}
        onEditar={handleAbrirEdicao}
        onExcluir={handleExcluirSetor}
      />
    </div>
  );
}
