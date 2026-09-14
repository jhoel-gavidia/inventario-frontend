import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
} from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      href: "/productos?action=create",
      label: "Nuevo producto",
      icon: Plus,
    },
    {
      href: "/movimientos?action=entrada",
      label: "Registrar entrada",
      icon: ArrowDownToLine,
    },
    {
      href: "/movimientos?action=salida",
      label: "Registrar salida",
      icon: ArrowUpFromLine,
    },
  ];

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-on-surface">
        Acciones rápidas
      </h2>

      <div className="grid gap-3 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 text-sm font-medium text-ink-muted transition hover:border-line-strong hover:bg-surface-hover"
            >
              <Icon className="h-5 w-5 text-outline" />

              {action.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}