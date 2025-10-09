"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  Users,
  Calendar,
  Settings,
  User,
  Bell,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock data - easy to replace with real data later
const navigationItems = [
  { href: "/home", label: "Início", icon: Home },
  { href: "/equipe", label: "Equipe", icon: Users },
  { href: "/calendario", label: "Calendário", icon: Calendar },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const avatarMenuItems = [
  { href: "/perfil", label: "Meu Perfil", icon: User },
  { href: "/notificacoes", label: "Notificações", icon: Bell, badge: 3 },
  { href: "/admin", label: "Admin", icon: Shield },
];

const mockUser = {
  name: "João Silva",
  email: "joao@email.com",
  avatar: "/diverse-user-avatars.png",
  initials: "JS",
};

export function NavUser() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleNavClick = () => {
    setSheetOpen(false);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // Add logout logic here
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[var(--bxb-red)] hover:text-white transition-colors"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-background">
        <SheetHeader className="text-left">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          {/* User info at top of sheet */}
          <div className="flex items-center gap-3 py-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={mockUser.avatar || "/placeholder.svg"}
                alt={mockUser.name}
              />
              <AvatarFallback className="bg-[var(--bxb-red)] text-white">
                {mockUser.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{mockUser.name}</span>
              <span className="text-xs text-muted-foreground">
                {mockUser.email}
              </span>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Navigation section */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navegação
            </h3>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[var(--bxb-red)] text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  );
}
