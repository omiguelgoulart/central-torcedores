// components/layout/nav-data.ts
import { Home, Calendar, Ticket, CreditCard, Gift, Newspaper, HelpCircle } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export const navItems: NavItem[] = [
  { label: "Início", href: "/", icon: Home },
  { label: "Jogos", href: "/jogos", icon: Calendar },
  { label: "Ingressos", href: "/ingressos", icon: Ticket },
  { label: "Planos", href: "/planos", icon: CreditCard },
  { label: "Benefícios", href: "/beneficios", icon: Gift },
  { label: "Notícias", href: "/noticias", icon: Newspaper },
  { label: "Suporte", href: "/suporte", icon: HelpCircle },
];
