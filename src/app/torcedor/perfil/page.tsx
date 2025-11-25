"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";


type StatusSocio = "ATIVO" | "INADIMPLENTE" | "CANCELADO" | null;

type StatusSocioKey = "ATIVO" | "INADIMPLENTE" | "CANCELADO" | "DESCONHECIDO";

type TorcedorPerfilResponse = {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cpf?: string | null;
  dataNascimento?: string | null;
  genero?: string | null;
  fotoUrl?: string | null;
  enderecoLogradouro?: string | null;
  enderecoNumero?: string | null;
  enderecoBairro?: string | null;
  enderecoCidade?: string | null;
  enderecoUF?: string | null;
  enderecoCEP?: string | null;
  statusSocio?: StatusSocio;
  aceitaMarketing?: boolean | null;
  origemCadastro?: string | null;
  gatewayClienteId?: string | null;
};

function getTorcedorIdFromCookies(): string | null {
  const direto = Cookies.get("id") || Cookies.get("usuarioId");
  if (direto) return direto;

  const auth = Cookies.get("auth");
  if (!auth) return null;

  try {
    const parsed: { id?: string; user?: { id?: string } } = JSON.parse(auth);
    if (parsed.user?.id) return parsed.user.id;
    if (parsed.id) return parsed.id;
    return null;
  } catch {
    return null;
  }
}

function formatDate(dateIso?: string | null): string {
  if (!dateIso) return "";
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR");
}

function PerfilField(props: { label: string; value?: string | null; type?: string }) {
  const { label, value, type = "text" } = props;
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <Input value={value ?? ""} type={type} readOnly className="bg-background" />
    </div>
  );
}

export default function PerfilPage() {
  const { usuario } = useAuth();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [torcedor, setTorcedor] = useState<TorcedorPerfilResponse | null>(null);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const idFromAuth = usuario?.id;
        const idFromCookie = getTorcedorIdFromCookies();
        const torcedorId = idFromAuth || idFromCookie;

        if (!torcedorId) {
          setErro("Usuário não encontrado.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/usuario/id/${torcedorId}`
        );

        if (!res.ok) {
          throw new Error("Erro ao buscar usuário");
        }

        const data = (await res.json()) as TorcedorPerfilResponse;
        setTorcedor(data);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar dados do perfil.");
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, [usuario?.id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Carregando seus dados...
      </div>
    );
  }

  if (erro || !torcedor) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        {erro || "Erro ao carregar dados."}
      </div>
    );
  }

  const statusLabel: Record<StatusSocioKey, string> = {
    ATIVO: "Sócio ativo",
    INADIMPLENTE: "Inadimplente",
    CANCELADO: "Associação cancelada",
    DESCONHECIDO: "Sem status",
  };

  const statusVariant: Record<
    StatusSocioKey,
    "default" | "destructive" | "outline"
  > = {
    ATIVO: "default",
    INADIMPLENTE: "destructive",
    CANCELADO: "outline",
    DESCONHECIDO: "outline",
  };

  const statusKey: StatusSocioKey = torcedor.statusSocio ?? "DESCONHECIDO";

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visualize e gerencie seus dados pessoais.
        </p>
      </div>

      {/* CARD DADOS PESSOAIS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Dados pessoais</CardTitle>
            <CardDescription>
              Informações principais do seu cadastro.
            </CardDescription>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusVariant[statusKey]}>
              {statusLabel[statusKey]}
            </Badge>
            {torcedor.matricula && (
              <p className="text-xs text-muted-foreground">
                Matrícula:{" "}
                <span className="font-medium text-foreground">
                  {torcedor.matricula}
                </span>
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <PerfilField label="Nome completo" value={torcedor.nome} />
            <PerfilField label="E-mail" value={torcedor.email} type="email" />
            <PerfilField label="Telefone" value={torcedor.telefone} />
            <PerfilField label="CPF" value={torcedor.cpf} />
            <PerfilField
              label="Data de nascimento"
              value={formatDate(torcedor.dataNascimento)}
            />
            <PerfilField label="Gênero" value={torcedor.genero} />
          </div>

        </CardContent>
      </Card>

      {/* CARD ENDEREÇO / PREFERÊNCIAS */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço e preferências</CardTitle>
          <CardDescription>Dados de localização e comunicação.</CardDescription>
        </CardHeader>


        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <PerfilField label="Logradouro" value={torcedor.enderecoLogradouro} />
            <PerfilField label="Número" value={torcedor.enderecoNumero} />
            <PerfilField label="Bairro" value={torcedor.enderecoBairro} />
            <PerfilField label="Cidade" value={torcedor.enderecoCidade} />
            <PerfilField label="UF" value={torcedor.enderecoUF} />
            <PerfilField label="CEP" value={torcedor.enderecoCEP} />
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Receber novidades
              </p>
              <p className="text-sm text-muted-foreground">
                Autoriza receber e-mails e comunicações do clube.
              </p>
            </div>
            <Switch checked={Boolean(torcedor.aceitaMarketing)} disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
