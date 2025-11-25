"use client"

import { Button } from "@/components/ui/button"
import { Menu, Bell, User } from "lucide-react"

interface AdminHeaderProps {
  onToggleSidebar: () => void
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-muted-foreground">
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
