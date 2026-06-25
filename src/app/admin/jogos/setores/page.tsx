"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminBreadcrumb } from "@/components/admin/ingresso/AdminBreadcrumb";
import { adminFetch } from "@/lib/adminFetch";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type Jogo = {
  id: string;
  nome: string;
  data: string;
  local: string;
};

export default function SetoresPorJogoPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch(`${API}/jogo`)
      .then((res) => res.json())
      .then((data) => setJogos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Jogos", href: "/admin/jogos" },
          { label: "Setores por Jogo", href: "/admin/jogos/setores" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold">Setores por Jogo</h1>
        <p className="text-muted-foreground">
          Selecione um jogo para configurar seus setores e capacidade.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jogos</CardTitle>
          <CardDescription>Clique em um jogo para gerenciar seus setores.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Carregando jogos...</p>}

          {!loading && jogos.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum jogo cadastrado.</p>
          )}

          {jogos.map((jogo) => (
            <div
              key={jogo.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium text-sm">{jogo.nome}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(jogo.data).toLocaleString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </Badge>
                  <Badge variant="outline" className="text-xs gap-1">
                    <MapPin className="w-3 h-3" />
                    {jogo.local}
                  </Badge>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href={`/admin/jogos/${jogo.id}?tab=sectors`}>
                  Ver Setores
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
