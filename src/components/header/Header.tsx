"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavUser } from "./NavUser"
import { UserAvatar } from "./AvatarUser"
import { User, Settings } from "lucide-react"

const userMoc = {
  name: "João Silva",
  email: "joao@email.com",
  status: "Sócio Ativo",
  imageUrl: "/diverse-user-avatars.png",
  initials: "JS",
};


export default function Header() {
  const pathname = usePathname()

// // oculta no login/cadastro
// const hideHeader = useMemo(
//   () => pathname === "/" || pathname === "/cadastro" || pathname === "/login",
//   [pathname]
// )
// if (hideHeader) return null


  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-[var(--bxb-black)]/95 bg-[var(--bxb-black)]">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side: Hamburger menu + Logo */}
        <div className="flex items-center gap-4">
          <NavUser />

          {/* Logo/Brand */}
          <Link href="/home" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[var(--bxb-red)] flex items-center justify-center font-bold text-sm">
                GE
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">Brasil de Pelotas</span>
            </div>
          </Link>
        </div>
        <UserAvatar />
      </div>
    </header>
  )
}
