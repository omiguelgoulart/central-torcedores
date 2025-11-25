"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  User as IconUsuario,
  IdCard,
  Ticket,
  HelpCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

type ItemMenu = {
  href: string;
  rotulo: string;
  icone: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const itensMenu: ItemMenu[] = [
  { href: "/torcedor/perfil", rotulo: "Meu Perfil", icone: IconUsuario },
  { href: "/torcedor/minhaAssociacao", rotulo: "Minha Associação", icone: IdCard },
  { href: "/torcedor/meusIngressos", rotulo: "Meus Ingressos", icone: Ticket },
  { href: "/torcedor/ajuda", rotulo: "Ajuda", icone: HelpCircle },
];

export function UserAvatar() {
  const { usuario, fetchMe, logout } = useAuth() as {
    usuario: {
      nome: string;
      email?: string;
      avatar?: string;
      status?: string;
    } | null;
    fetchMe?: () => Promise<void>;
    logout: () => void;
  };

  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!usuario && typeof fetchMe === "function") {
        try {
          await fetchMe();
        } catch {}
      }
      setBooting(false);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (booting && !usuario) {
    return (
      <div className="h-8 w-[160px] animate-pulse rounded-md bg-muted/50" />
    );
  }

  if (!usuario) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild>
          <Link href="/cadastro">Criar conta</Link>
        </Button>
      </div>
    );
  }

  const iniciais =
    usuario.nome
      ?.trim()
      .split(/\s+/)
      .map((n) => n[0] ?? "")
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "US";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Abrir menu"
          className="flex items-center gap-2 rounded-full hover:opacity-80 transition"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={usuario?.avatar || "/placeholder.svg"}
              alt="avatar"
            />
            <AvatarFallback className="bg-zinc-700 text-white">
              {iniciais}
            </AvatarFallback>
          </Avatar>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-[280px] sm:w-[300px] flex-col justify-between border-none bg-zinc-950 p-0 text-white"
      >
        {/* Parte superior: menu */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={usuario?.avatar || "/placeholder.svg"}
                alt="avatar"
              />
              <AvatarFallback className="bg-zinc-700 text-white">
                {iniciais}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">
                {usuario?.nome}
              </p>
              {usuario?.email && (
                <p className="truncate text-sm text-zinc-400">
                  {usuario.email}
                </p>
              )}
            </div>
          </div>

          <nav className="flex flex-col mt-1">
            {itensMenu.map(({ href, rotulo, icone: Icone }) => (
              <SheetClose asChild key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 text-zinc-100 hover:bg-zinc-900 transition-colors"
                >
                  <Icone className="h-5 w-5" />
                  <span className="text-[15px] font-medium">{rotulo}</span>
                </Link>
              </SheetClose>
            ))}
          </nav>
        </div>

        {/* Parte inferior: botão de logout */}
        <div className="p-4 border-t border-zinc-800">
          <Button
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
