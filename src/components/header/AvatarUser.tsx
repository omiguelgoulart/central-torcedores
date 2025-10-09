"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, IdCard, Ticket, Bell, Settings, HelpCircle } from "lucide-react";

// tipo auxiliar
type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

// 🔹 dados mocados (usuário e itens)
const mockUser = {
  name: "João Silva",
  email: "joao@email.com",
  status: "Sócio Ativo",
  imageUrl: "/diverse-user-avatars.png",
};

const mockItems: MenuItem[] = [
  { href: "/perfil", label: "Meu Perfil", icon: User },
  { href: "/plano", label: "Minha Associação", icon: IdCard },
  { href: "/meus-ingressos", label: "Meus Ingressos", icon: Ticket },
  { href: "/notificacoes", label: "Notificações", icon: Bell },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: "/ajuda", label: "Ajuda / Suporte", icon: HelpCircle },
];

export function UserAvatar() {
  const user = mockUser;
  const items = mockItems;

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "US";

  return (
    <DropdownMenu>
      {/* Avatar do topo */}
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Abrir menu do usuário"
          className="rounded-full outline-none ring-offset-2 transition-all hover:ring-2 hover:ring-gray-300 focus:ring-2 focus:ring-gray-300"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="bg-gray-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* Conteúdo do menu */}
      <DropdownMenuContent align="end" className="w-64">
        {/* Cabeçalho */}
        <div className="flex items-center space-x-3 border-b p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="bg-gray-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{user.name}</p>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
            {user.status && (
              <p className="text-xs font-medium text-green-600">
                {user.status}
              </p>
            )}
          </div>
        </div>

        {/* Itens */}
        {items.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link
              href={href}
              className="flex cursor-pointer items-center space-x-2 px-3 py-2"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem asChild>
          <Link
            href="/"
            className="flex cursor-pointer items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
