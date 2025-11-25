"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiltroSelect } from "@/components/admin/plano/FiltroSelectPlano";
import { FiltroBusca } from "@/components/admin/plano/FiltroBuscaPlano";
import {
  peridiocidadePlano,
  Plano,
  TabelaPlanos,
} from "@/components/admin/plano/TabelaPlanos";
import {
  PlanoDialog,
  PlanoFormMode,
  PlanoFormValues,
} from "@/components/admin/plano/PlanoDialog";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type BeneficioListaApi = {
  id: string;
  titulo: string;
  descricao: string | null;
};

type PlanosListaApi = {
  id: string;
  nome: string;
  valor: number | string;
  periodicidade: string;
  beneficios?: BeneficioListaApi[];
};

type PeriodicidadeFiltro = "TODOS" | peridiocidadePlano;

export default function PaginaPlanos() {

  const router = useRouter();
  
  const [termoBusca, setTermoBusca] = useState<string>("");
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [periodicidadeFiltro, setPeriodicidadeFiltro] =
    useState<PeriodicidadeFiltro>("TODOS");
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // dialog de plano
  const [planoDialogOpen, setPlanoDialogOpen] = useState<boolean>(false);
  const [planoDialogMode, setPlanoDialogMode] =
    useState<PlanoFormMode>("create");
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);
  const [salvandoPlano, setSalvandoPlano] = useState<boolean>(false);

  async function carregarPlanos() {
    try {
      setCarregando(true);
      setErro(null);

      const response = await fetch(`${API}/planos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Falha no GET /planos");
        setPlanos([]);
        return;
      }

      const dados = (await response.json()) as PlanosListaApi[];

      if (!Array.isArray(dados)) {
        setPlanos([]);
        return;
      }

      const planosMapeados: Plano[] = dados.map((planoApi) => {
        const periodicidadeRaw = (
          planoApi.periodicidade ?? "MENSAL"
        ).toUpperCase();

        const periodicidade: peridiocidadePlano =
          periodicidadeRaw === "MENSAL" ||
          periodicidadeRaw === "TRIMESTRAL" ||
          periodicidadeRaw === "SEMESTRAL" ||
          periodicidadeRaw === "ANUAL"
            ? periodicidadeRaw
            : "MENSAL";

        const valorNumero =
          typeof planoApi.valor === "number"
            ? planoApi.valor
            : Number(planoApi.valor);

        return {
          id: planoApi.id,
          nome: planoApi.nome,
          valor: Number.isNaN(valorNumero) ? 0 : valorNumero,
          periodicidade,
          destaque: false,
          ativo: true,
        };
      });

      setPlanos(planosMapeados);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar planos da API.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarPlanos();
  }, []);

  const planosFiltrados = useMemo(() => {
    return planos.filter((plano) => {
      const correspondeBusca = plano.nome
        .toLowerCase()
        .includes(termoBusca.toLowerCase());
      const correspondePeriodicidade =
        periodicidadeFiltro === "TODOS" ||
        plano.periodicidade === periodicidadeFiltro;

      return correspondeBusca && correspondePeriodicidade;
    });
  }, [planos, termoBusca, periodicidadeFiltro]);

  async function handleSubmitPlano(values: PlanoFormValues) {
    try {
      setSalvandoPlano(true);
      setErro(null);

      const valorNumero = Number(values.valor.replace(",", "."));
      if (Number.isNaN(valorNumero)) {
        throw new Error("Informe um valor válido para o plano.");
      }

      const payload = {
        nome: values.nome.trim(),
        valor: valorNumero,
        Periodicidade: values.periodicidade,
        descricao: values.descricao.trim(),
      };

      if (planoDialogMode === "create") {
        const res = await fetch(`${API}/planos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(data?.error ?? "Erro ao criar plano");
        }
      } else if (planoDialogMode === "edit" && planoSelecionado) {
        const res = await fetch(`${API}/planos/${planoSelecionado.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(data?.error ?? "Erro ao atualizar plano");
        }
      }

      await carregarPlanos();
      setPlanoDialogOpen(false);
      setPlanoSelecionado(null);
    } catch (error) {
      console.error(error);
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o plano. Tente novamente."
      );
    } finally {
      setSalvandoPlano(false);
    }
  }

  async function handleDeletePlano(plano: Plano) {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o plano "${plano.nome}"?`
    );
    if (!confirmou) return;

    try {
      setCarregando(true);
      setErro(null);

      const res = await fetch(`${API}/planos/${plano.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Erro ao excluir plano");
      }

      await carregarPlanos();
    } catch (error) {
      console.error(error);
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o plano. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Planos</h1>
          <p className="text-muted-foreground">
            Gerenciar planos de assinatura
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setPlanoDialogMode("create");
            setPlanoSelecionado(null);
            setPlanoDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Novo Plano
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <FiltroBusca
              id="busca-planos"
              label="Buscar"
              placeholder="Nome do plano..."
              value={termoBusca}
              onChange={setTermoBusca}
            />

            <FiltroSelect
              label="Periodicidade"
              value={periodicidadeFiltro}
              onChange={(value) =>
                setPeriodicidadeFiltro(value as PeriodicidadeFiltro)
              }
              options={[
                { label: "Todos", value: "TODOS" },
                { label: "Mensal", value: "MENSAL" },
                { label: "Trimestral", value: "TRIMESTRAL" },
                { label: "Semestral", value: "SEMESTRAL" },
                { label: "Anual", value: "ANUAL" },
              ]}
            />
          </div>

          {carregando && (
            <p className="mt-3 text-xs text-muted-foreground">
              Carregando planos da API...
            </p>
          )}

          {erro && <p className="mt-3 text-xs text-destructive">{erro}</p>}
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Lista de Planos ({planosFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabelaPlanos
            planos={planosFiltrados}
            onEditPlano={(plano) => {
              setPlanoSelecionado(plano);
              setPlanoDialogMode("edit");
              setPlanoDialogOpen(true);
            }}
            onDeletePlano={handleDeletePlano}
            onEditarBeneficios={(plano) => {
              router.push(`/admin/planos/${plano.id}`);
            }}
          />
        </CardContent>
      </Card>

      {/* Dialog de Plano */}
      <PlanoDialog
        open={planoDialogOpen}
        onOpenChange={setPlanoDialogOpen}
        mode={planoDialogMode}
        initialData={planoSelecionado}
        onSubmit={handleSubmitPlano}
        submitting={salvandoPlano}
      />
    </div>
  );
}
