"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  Home,
  Ticket,
  CreditCard,
  Gift,
  LogOut,
  User,
  Award as IdCard,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react"

const navigationItems = [
  { href: "/home", label: "Início", icon: Home },
  { href: "/ingressos", label: "Comprar Ingressos", icon: Ticket },
  { href: "/meus-ingressos", label: "Meus Ingressos", icon: Ticket },
  { href: "/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/beneficios", label: "Benefícios", icon: Gift },
]

const avatarMenuItems = [
  { href: "/perfil", label: "Meu Perfil", icon: User },
  { href: "/plano", label: "Minha Associação", icon: IdCard },
  { href: "/meus-ingressos", label: "Meus Ingressos", icon: Ticket },
  { href: "/notificacoes", label: "Notificações", icon: Bell },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: "/ajuda", label: "Ajuda / Suporte", icon: HelpCircle },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Don't show header on login and register pages
  if (pathname === "/" || pathname === "/cadastro") {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden mr-3">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 pb-6 border-b">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/diverse-user-avatars.png" alt="Avatar do usuário" />
                    <AvatarFallback className="bg-gray-600 text-white">JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">João Silva</h2>
                    <p className="text-sm text-gray-500 truncate">joao@email.com</p>
                    <p className="text-xs text-green-600 font-medium">Sócio Ativo</p>
                  </div>
                </div>

                <div className="py-4 border-b">
                  <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Minha Conta
                  </h3>
                  <div className="space-y-1">
                    {avatarMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4">
                  <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Navegação</h3>
                  <div className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            pathname === item.href
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </nav>

                {/* Footer */}
                <div className="border-t pt-4">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full flex items-center space-x-2 bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo */}
          <Link href="/home" className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">CE</span>
            </div>
            <span className="font-semibold text-gray-900">Clube Esportivo</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Desktop Dropdown */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all">
                  <AvatarImage src="/diverse-user-avatars.png" alt="Avatar do usuário" />
                  <AvatarFallback className="bg-gray-600 text-white text-sm">JS</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center space-x-3 p-3 border-b">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/diverse-user-avatars.png" alt="Avatar do usuário" />
                    <AvatarFallback className="bg-gray-600 text-white text-sm">JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">João Silva</p>
                    <p className="text-sm text-gray-500 truncate">joao@email.com</p>
                    <p className="text-xs text-green-600 font-medium">Sócio Ativo</p>
                  </div>
                </div>

                {avatarMenuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center space-x-2 px-3 py-2 cursor-pointer">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="flex items-center space-x-2 px-3 py-2 cursor-pointer text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Avatar */}
          <div className="md:hidden">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/diverse-user-avatars.png" alt="Avatar do usuário" />
              <AvatarFallback className="bg-gray-600 text-white text-sm">JS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
