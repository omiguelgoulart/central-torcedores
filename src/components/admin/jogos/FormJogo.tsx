"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

export type Jogo = {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao?: string | null;
};

type JogoFormProps = {
  mode: "create" | "edit";
  initialData?: Jogo | null;
  onSuccess?: (jogo: Jogo) => void;
  onCancel?: () => void;
};

type FormState = {
  nome: string;
  data: string;
  local: string;
  descricao: string;
};

export function FormJogo({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: JogoFormProps) {
  const [values, setValues] = useState<FormState>({
    nome: "",
    data: "",
    local: "Bento Freitas",
    descricao: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      const iso = new Date(initialData.data);
      const yyyy = iso.getFullYear();
      const mm = String(iso.getMonth() + 1).padStart(2, "0");
      const dd = String(iso.getDate()).padStart(2, "0");

      setValues({
        nome: initialData.nome ?? "",
        data: `${yyyy}-${mm}-${dd}`,
        local: initialData.local ?? "Bento Freitas",
        descricao: initialData.descricao ?? "",
      });
    }
  }, [initialData]);

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        nome: values.nome,
        data: values.data,
        local: values.local,
        descricao: values.descricao,
      };

      const isEdit = mode === "edit" && !!initialData;

      const endpoint = isEdit
        ? `${API}/admin/jogo/${initialData!.id}`
        : `${API}/admin/jogo`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      if (mode === "create") {
        const jogoResult: Jogo = {
          id: data.jogoId,
          ...payload,
        };
        onSuccess?.(jogoResult);
      } else {
        const jogoResult: Jogo = {
          id: initialData!.id,
          ...payload,
        };
        onSuccess?.(jogoResult);
      }
    } catch {
      setError("Não foi possível salvar o jogo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label htmlFor="nome">Nome do jogo</Label>
        <Input
          id="nome"
          value={values.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          placeholder="Brasil x Adversário"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={values.data}
            onChange={(e) => handleChange("data", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="local">Local</Label>
          <Input
            id="local"
            value={values.local}
            onChange={(e) => handleChange("local", e.target.value)}
            placeholder="Bento Freitas"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={values.descricao}
          onChange={(e) => handleChange("descricao", e.target.value)}
          placeholder="Ex: Jogo importante para o campeonato..."
          rows={3}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}

        <Button type="submit" disabled={loading}>
          {loading
            ? "Salvando..."
            : mode === "create"
            ? "Criar jogo"
            : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
