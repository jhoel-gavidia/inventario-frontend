const stats = [
  {
    label: "Stock Total",
    value: "4,120",
    description: "284 repuestos registrados",
    badge: "12 sin stock",
  },
  {
    label: "Categorías",
    value: "6",
    description: "Familias registradas",
  },
  {
    label: "Movimientos Hoy",
    value: "38",
    description: "24 entradas • 14 salidas",
  },
  {
    label: "Valor Inventario",
    value: "S/ 28,450",
    description: "Margen est.: S/ 9,820 (34.5%) • Hoy",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-surface-container-lowest p-4 shadow-xs transition-all hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-secondary">
              {stat.label}
            </span>

            {stat.badge && (
              <span className="rounded border border-red-100 bg-red-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-red-600">
                {stat.badge}
              </span>
            )}
          </div>

          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">
              {stat.value}
            </div>

            <span className="font-mono text-xs text-slate-500">
              {stat.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}