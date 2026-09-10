import type { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
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