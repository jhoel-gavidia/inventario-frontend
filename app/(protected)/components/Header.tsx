"use client";

import {
  CalendarDays,
  Factory,
  Search,
} from "lucide-react";

import type { SessionUser } from "@/features/auth/types/auth";

interface HeaderProps {
  user: SessionUser | null;
}

const todayFormatter = new Intl.DateTimeFormat("es-PE", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

function getInitials(username: string): string {
  if (!username) {
    return "?";
  }

  return username.slice(0, 2).toUpperCase();
}

export function Header({ user }: HeaderProps) {
  const username = user?.username ?? "Usuario";
  const isAdmin = user?.rol === "ADMIN";

  return (
    <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-surface-container-lowest/95 px-6 backdrop-blur-md">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-primary">
          <Factory size={18} />
        </div>

        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="font-semibold text-slate-800">
            Jhoelito
          </span>

          <span className="text-slate-400">/</span>

          <span className="font-semibold text-primary">
            Panel de Control
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        {/* Buscar */}
        <div className="hidden min-w-70 items-center gap-2 rounded-lg border border-slate-200/80 bg-surface-container-low px-3 py-1.5 text-on-surface-variant transition-colors focus-within:border-primary md:flex">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Buscar código SKU o repuesto..."
            className="w-full border-none bg-transparent p-0 text-xs text-on-surface outline-none placeholder:text-slate-400 focus:ring-0"
          />
        </div>

        {/* Fecha */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-100 px-2 py-1 font-mono text-[11px] font-medium capitalize text-slate-600 xl:flex">
          <CalendarDays size={14} className="text-primary" />
          <span>{todayFormatter.format(new Date())}</span>
        </div>

        {/* Usuario */}
        <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-surface-container-low px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-white ring-2 ring-primary/20">
            {getInitials(username)}
          </div>

          <div className="hidden flex-col pr-1 leading-none sm:flex">
            <div className="flex items-center gap-1">
              <span className="max-w-32 truncate text-xs font-bold text-on-surface">
                {username}
              </span>

              <span className="rounded bg-blue-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                {isAdmin ? "ADMIN" : "USER"}
              </span>
            </div>

            <span className="mt-0.5 text-[11px] text-secondary">
              {isAdmin ? "Administrador" : "Operador"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}