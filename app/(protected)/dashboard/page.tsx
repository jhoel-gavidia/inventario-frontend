"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";

export default function DashboardPage() {
  const { isAuthenticated, isChecking } = useAuth();

  if (isChecking || !isAuthenticated) {
    return null;
  }

  return (
    <main className="w-full px-6 py-6">
      {/* Aquí vamos a pasar tu HTML del Dashboard */}
    </main>
  );
}