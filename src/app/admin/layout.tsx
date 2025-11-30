"use client";

import { AdminHeader } from "@/components/admin/HeaderAdmin";
import { AdminSidebar } from "@/components/admin/Sidebar";
import type React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

type AdminRole = "SUPER_ADMIN" | "OPERACIONAL" | "PORTARIA" | string;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";
  const isCheckinRoute = pathname.startsWith("/admin/checkin");

  useEffect(() => {
    const token = Cookies.get("adminToken");

    if (!token) {
      setIsAuthenticated(false);

      if (!isLoginPage) {
        router.push("/admin/login");
      }

      return;
    }

    const roleFromCookie = Cookies.get("adminRole") as AdminRole | undefined;
    setAdminRole(roleFromCookie ?? null);
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

  if (adminRole === "PORTARIA" && !isCheckinRoute && !isLoginPage) {
    router.push("/admin/checkin");
    return (
      <main className="flex items-center justify-center h-screen">
        Redirecionando para área de check-in...
      </main>
    );
  }

  if (isCheckinRoute) {
    return (
      <main className="min-h-screen w-full p-4 bg-muted/30">
        {children}
      </main>
    );
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
