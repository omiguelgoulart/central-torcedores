"use client"

import { AdminHeader } from "@/components/admin/HeaderAdmin"
import { AdminSidebar } from "@/components/admin/Sidebar"
import type React from "react"

import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen">
      <AdminSidebar open={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  )
}
