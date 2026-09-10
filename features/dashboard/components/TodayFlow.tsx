const categories = [
  {
    name: "Motor & Carburación",
    value: "14 / 6",
    percentage: 70,
    className: "bg-blue-600",
  },
  {
    name: "Frenos & Suspensión",
    value: "15 / 4",
    percentage: 78,
    className: "bg-amber-500",
  },
  {
    name: "Transmisión",
    value: "10 / 3",
    percentage: 76,
    className: "bg-emerald-600",
  },
  {
    name: "Sistema Eléctrico",
    value: "6 / 1",
    percentage: 85,
    className: "bg-indigo-500",
  },
];

const topProducts = [
  ["Cable Embrague Torito", "46 uds"],
  ["Aceite 20W50 4T Castrol", "38 uds"],
  ["Zapatas de Freno Torito", "29 uds"],
];

export function TodayFlow() {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-surface-container-lowest p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          Flujo de Hoy
        </h3>

        <span className="font-mono text-[11px] font-medium text-secondary">
          24 Oct
        </span>
      </div>

      <div className="flex flex-col gap-3 pt-1">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col gap-1">
            <div className="flex justify-between font-mono text-xs text-slate-700">
              <span>{category.name}</span>
              <span className="text-slate-400">{category.value}</span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full ${category.className}`}
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            Mayor Rotación (Salidas)
          </h4>

          <span className="text-slate-400">↗</span>
        </div>

        <div className="flex flex-col divide-y divide-slate-100/80">
          {topProducts.map(([product, quantity], index) => (
            <div
              key={product}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex min-w-0 items-center gap-2 pr-2">
                <span className="w-4 shrink-0 text-center font-mono text-[11px] font-bold text-primary">
                  {index + 1}
                </span>

                <span className="truncate text-xs font-medium text-slate-800">
                  {product}
                </span>
              </div>

              <span className="shrink-0 font-mono text-xs font-semibold text-slate-900">
                {quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}