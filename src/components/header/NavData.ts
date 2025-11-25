// components/layout/nav-data.ts
import { Home, Calendar, CreditCard } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export const navItems: NavItem[] = [
  { label: "Início", href: "/", icon: Home },
  { label: "Jogos", href: "/partidas", icon: Calendar },
  { label: "Planos", href: "/planos", icon: CreditCard },
];
