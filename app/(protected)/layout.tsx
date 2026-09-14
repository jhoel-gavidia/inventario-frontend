"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { useAuth } from "@/features/auth/hooks/use-auth";

const ADMIN_ROUTES = new Set(["/usuarios", "/auditorias"]);

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const { isChecking, user, isAdmin } = useAuth();
  const pathname = usePathname();

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-secondary">
          Verificando sesión...
        </div>
      </main>
    );
  }

  if (ADMIN_ROUTES.has(pathname) && !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-medium text-secondary">
          No tienes permisos para acceder a esta sección.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} />

      <div className="pl-64">
        <Header user={user} />

        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}

