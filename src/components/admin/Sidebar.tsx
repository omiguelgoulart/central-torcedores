"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutGrid, Trophy, Users, DollarSign, Ticket, Settings, LogOut, ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin/",
    icon: LayoutGrid,
  },
  {
    title: "Jogos",
    href: "/admin/jogos",
    icon: Trophy,
    items: [
      { title: "Listar Jogos", href: "/admin/jogos" },
      { title: "Setores por Jogo", href: "/admin/jogos/setores" },
      { title: "Lotes", href: "/admin/games/lots" },
    ],
  },
  {
    title: "Estádio",
    href: "/admin/estadio",
    icon: Ticket,
    items: [{ title: "Setores", href: "/admin/estadio/setores" }],
  },
  {
    title: "Torcedores",
    href: "/admin/torcedores",
    icon: Users,
    items: [
      { title: "Torcedores", href: "/admin/torcedores" },
      { title: "Assinaturas", href: "/admin/members/assinaturas" },
      { title: "Faturas", href: "/admin/members/faturas" },
    ],
  },
  {
    title: "Planos",
    href: "/admin/planos",
    icon: Trophy,
    items: [
      { title: "Planos", href: "/admin/planos" },
      { title: "Benefícios", href: "/admin/plans/benefits" },
    ],
  },
  {
    title: "Ingressos",
    href: "/admin/ingressos",
    icon: Ticket,
    items: [
      { title: "Pedidos", href: "/admin/tickets/pedidos" },
      { title: "Check-ins", href: "/admin/tickets/checkins" },
    ],
  },
  {
    title: "Financeiro",
    href: "/admin/pagamentos",
    icon: DollarSign,
    items: [{ title: "Pagamentos", href: "/admin/pagamentos" }],
  },
  {
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
    items: [
      { title: "Admins", href: "/admin/settings/admins" },
      { title: "ASAAS", href: "/admin/settings/asaas" },
    ],
  },
]

interface AdminSidebarProps {
  open: boolean
}

export function AdminSidebar({ open }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string | null>(null)

  function toggleMenu(id: string) {
    setExpanded((current) => (current === id ? null : id))
  }

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        open ? "w-64" : "w-20",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
          <Link href="/admin/" className="flex items-center gap-3 px-4">
          <Image
            src="/brasil-logo.png"
            alt="Central Torcedores"
            width={35}
            height={35}
          />
            {open && <span className="font-bold text-sidebar-foreground text-sm">Central Torcedores</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const hasChildren = !!item.items?.length
              const isParentActive = pathname.startsWith(item.href)
              const isExpanded = expanded === item.href || (hasChildren && isParentActive)

              return (
                <li key={item.href}>
                  {hasChildren ? (
                    // Botão que abre/fecha o menu suspenso
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.href)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isParentActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        !open && "justify-center",
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {open && (
                        <>
                          <span className="text-sm flex-1 text-left">{item.title}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 opacity-70" />
                          ) : (
                            <ChevronRight className="w-4 h-4 opacity-70" />
                          )}
                        </>
                      )}
                    </button>
                  ) : (
                    // Item simples, sem submenu
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        pathname === item.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        !open && "justify-center",
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {open && <span className="text-sm">{item.title}</span>}
                    </Link>
                  )}

                  {/* Subitens – aparecem só quando o sidebar está aberto e o menu está expandido */}
                  {open && hasChildren && isExpanded && (
                    <ul className="mt-1 ml-8 space-y-1">
                      {item.items!.map((subitem) => (
                        <li key={subitem.href}>
                          <Link
                            href={subitem.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors",
                              pathname === subitem.href
                                ? "bg-sidebar-primary/20 text-sidebar-primary"
                                : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                            )}
                          >
                            {subitem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <button
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
              !open && "justify-center",
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {open && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
