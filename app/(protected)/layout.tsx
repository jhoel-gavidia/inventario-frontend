"use client";

import type { ReactNode } from "react";

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const { isChecking } = useAuth();

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-secondary">
          Verificando sesión...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="pl-64">
        <Header />

        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}