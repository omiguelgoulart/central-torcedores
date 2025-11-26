"use client";

import { AdminHeader } from "@/components/admin/HeaderAdmin";
import { AdminSidebar } from "@/components/admin/Sidebar";
import type React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const token = Cookies.get("adminToken");

    if (!token) {
      setIsAuthenticated(false);

      if (!isLoginPage) {
        router.push("/admin/login");
      }

      return;
    }

    setIsAuthenticated(true);
  }, [router, isLoginPage]);

  if (isAuthenticated === null) {
    return (
      <main className="flex items-center justify-center h-screen">
        Carregando...
      </main>
    );
  }

  if (!isAuthenticated) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar open={sidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
