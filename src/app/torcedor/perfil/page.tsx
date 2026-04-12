"use client";

import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Camera } from "lucide-react";

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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

type StatusSocio = "ATIVO" | "INADIMPLENTE" | "CANCELADO" | null;

type StatusBadgeMeta = {
  label: string;
  variant: "default" | "destructive" | "outline";
};

function getStatusBadgeMeta(status: StatusSocio): StatusBadgeMeta {
  switch (status) {
    case "ATIVO":
      return { label: "Sócio ativo", variant: "default" };
    case "INADIMPLENTE":
      return { label: "Inadimplente", variant: "destructive" };
    case "CANCELADO":
      return { label: "Associação cancelada", variant: "outline" };
    default:
      return { label: "Sem status", variant: "outline" };
  }
}

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

function PerfilField(props: {
  label: string;
  value?: string | null;
  type?: string;
}) {
  const { label, value, type = "text" } = props;
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <Input
        value={value ?? ""}
        type={type}
        readOnly
        className="bg-background"
      />
    </div>
  );
}

export default function PerfilPage() {
  const { torcedor: authTorcedor } = useAuth();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [torcedor, setTorcedor] = useState<TorcedorPerfilResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputFotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const idFromAuth = authTorcedor?.id;
        const idFromCookie = getTorcedorIdFromCookies();
        const torcedorId = idFromAuth || idFromCookie;

        if (!torcedorId) {
          setErro("Usuário não encontrado.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/usuario/id/${torcedorId}`,
          {},
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
  }, [authTorcedor?.id]);

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

  const statusBadgeMeta = getStatusBadgeMeta(torcedor.statusSocio ?? null);

  async function handleUploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }

    const authCookie = Cookies.get("auth");
    if (!authCookie) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    let token: string | undefined;
    try {
      const parsed = JSON.parse(authCookie) as { token?: string };
      token = parsed.token;
    } catch {
      toast.error("Erro ao ler sessão.");
      return;
    }

    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("foto", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuario/foto/url`,
        {
          credentials: "include",
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const body = (await res.json().catch(() => null)) as {
        fotoUrl?: string;
        error?: string;
        detalhes?: string;
      } | null;

      if (!res.ok) {
        toast.error(body?.error || "Erro ao enviar foto.");
        if (body?.detalhes)
          console.error("Detalhe do servidor:", body.detalhes);
        return;
      }

      if (body?.fotoUrl) {
        setTorcedor((prev) =>
          prev ? { ...prev, fotoUrl: body.fotoUrl! } : prev,
        );
      }

      toast.success("Foto atualizada com sucesso!");
    } catch {
      toast.error("Erro inesperado ao enviar foto.");
    } finally {
      setUploading(false);
      if (inputFotoRef.current) inputFotoRef.current.value = "";
    }
  }

  const iniciais =
    torcedor.nome
      ?.trim()
      .split(/\s+/)
      .map((n) => n[0] ?? "")
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "US";

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visualize e gerencie seus dados pessoais.
        </p>
      </div>

      {/* FOTO DE PERFIL */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={torcedor.fotoUrl || undefined}
              alt="Foto de perfil"
            />
            <AvatarFallback className="text-lg">{iniciais}</AvatarFallback>
          </Avatar>

          <button
            type="button"
            disabled={uploading}
            onClick={() => inputFotoRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
            aria-label="Alterar foto de perfil"
          >
            <Camera className="h-6 w-6 text-white" />
          </button>

          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadFoto}
          />
        </div>

        <div>
          <p className="font-semibold">{torcedor.nome}</p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputFotoRef.current?.click()}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            {uploading ? "Enviando..." : "Alterar foto"}
          </button>
        </div>
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
            <Badge variant={statusBadgeMeta.variant}>
              {statusBadgeMeta.label}
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
            <PerfilField
              label="Logradouro"
              value={torcedor.enderecoLogradouro}
            />
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
