"use client";

import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CadastroCustomerIdFormProps {
  defaultName?: string;
  defaultEmail?: string;
  onCustomerCreated?: (customerId: string) => void;
}

export function CadastroCustomerIdForm({ defaultName, defaultEmail, onCustomerCreated }: CadastroCustomerIdFormProps) {
  const [nome, setNome] = useState(defaultName ?? "");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultName) setNome(defaultName);
  }, [defaultName]);

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!nome.trim() || !email.trim() || !cpf.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asaas/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          cpfCnpj: cpf.replace(/\D/g, ""), 
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao criar cliente");
      }

      const data = await res.json();
      const customerId = data?.id ?? data?.customerId ?? data?.clienteId;
      if (!customerId) {
        throw new Error("ID do cliente não retornado pelo servidor");
      }

      toast.success("Cadastro criado com sucesso.");
      onCustomerCreated?.(customerId);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      const message =
        error instanceof Error ? error.message : "Erro ao criar cliente";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Informações de pagamento</CardTitle>
          <CardDescription>
            Antes de continuar, precisamos criar seu cadastro no sistema de
            pagamentos.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? "Criando cadastro..." : "Criar cadastro e continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
