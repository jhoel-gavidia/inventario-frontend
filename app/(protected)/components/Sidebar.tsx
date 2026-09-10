"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/services/auth-service";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ArrowLeftRight,
  Users,
  ShieldCheck,
  Wrench,
  LogOut,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Productos",
    href: "/productos",
    icon: Package,
  },
  {
    label: "Categorías",
    href: "/categorias",
    icon: Tags,
  },
  {
    label: "Movimientos",
    href: "/movimientos",
    icon: ArrowLeftRight,
  },
  {
    label: "Usuarios",
    href: "/usuarios",
    icon: Users,
    admin: true,
  },
  {
    label: "Auditoría",
    href: "/auditoria",
    icon: ShieldCheck,
    admin: true,
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await logout();
      router.replace("/auth/login");
    } catch {
      router.replace("/auth/login");
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-surface-container-lowest">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-200/80 px-4">
          <div className="flex h-10 items-center">
            <span className="text-xl font-bold tracking-tight text-primary">
              R&S Jhoelito
            </span>
          </div>
        </div>

        {/* Menú */}
        <div className="px-3 py-2">
          <p className="mb-1 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
            Menú Operativo
          </p>

          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                    isActive
                      ? "bg-primary-container font-semibold text-white shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.8} />

                  <span className="flex-1">{item.label}</span>

                  {item.admin && (
                    <span
                      className={`rounded bg-inverse-surface px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-inverse-on-surface"
                      }`}
                    >
                      ADMIN
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="border-t border-slate-200/80 bg-surface-container-low/60 p-4">
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200/70 bg-surface-container-lowest p-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
            <Wrench size={18} />
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Taller Activo
            </span>

            <span className="truncate text-xs font-bold text-on-surface">
              Sede Matriz - Jhoelito
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-surface-container-lowest px-3 py-2 text-error shadow-sm transition-colors hover:bg-error-container/20 hover:text-on-error-container"
        >
          <span className="flex items-center gap-1 text-xs font-semibold">
            <LogOut size={18} />
            Cerrar Sesión
          </span>

          <ChevronRight size={16} />
        </button>
      </div>
    </aside>
  );
}
