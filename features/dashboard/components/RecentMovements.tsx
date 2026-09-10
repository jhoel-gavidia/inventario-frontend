const movements = [
  {
    code: "#8842",
    time: "10:42 AM",
    type: "Entrada",
    product: "Cable de Embrague Reforzado Torito",
    quantity: "+30",
  },
  {
    code: "#8841",
    time: "10:15 AM",
    type: "Salida",
    product: "Kit Corona y Piñón 15T TVS King",
    quantity: "-2",
  },
  {
    code: "#8840",
    time: "09:50 AM",
    type: "Salida",
    product: "Aceite 20W50 4T Castrol Actevo",
    quantity: "-4",
  },
  {
    code: "#8839",
    time: "09:12 AM",
    type: "Entrada",
    product: "Zapatas de Freno Traseras Torito",
    quantity: "+15",
  },
  {
    code: "#8838",
    time: "08:35 AM",
    type: "Salida",
    product: "Filtro de Aire Lavable Torito FL",
    quantity: "-1",
  },
];

export function RecentMovements() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-surface-container-lowest shadow-xs">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900">
            Movimientos Recientes
          </h2>

          <div className="inline-flex rounded-lg border border-slate-200/70 bg-slate-100 p-0.5 font-mono text-xs">
            <button
              type="button"
              className="rounded bg-white px-2.5 py-1 font-semibold text-primary shadow-2xs"
            >
              Todos
            </button>

            <button
              type="button"
              className="rounded px-2.5 py-1 text-slate-600"
            >
              Entradas (+)
            </button>

            <button
              type="button"
              className="rounded px-2.5 py-1 text-slate-600"
            >
              Salidas (-)
            </button>
          </div>
        </div>

        <a
          href="/movimientos"
          className="font-mono text-xs font-semibold text-primary hover:underline"
        >
          Ver historial completo
        </a>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Hora</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Repuesto</th>
              <th className="px-4 py-3 text-right font-medium">Cantidad</th>
              <th className="px-4 py-3 text-center font-medium">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {movements.map((movement) => {
              const isEntry = movement.type === "Entrada";

              return (
                <tr
                  key={movement.code}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                    {movement.code}
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                    {movement.time}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isEntry ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {movement.type}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-900">
                    {movement.product}
                  </td>

                  <td
                    className={`px-4 py-3 text-right font-mono font-bold ${
                      isEntry ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {movement.quantity}
                  </td>

                  <td className="px-4 py-3 text-center font-mono text-[11px] text-slate-400">
                    Listo
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
          <span>
            Trazabilidad activa: Último movimiento registrado hace 8 min (
            <strong className="text-slate-700">#8842</strong> por{" "}
            <strong className="text-slate-700">Jhoelito</strong>)
          </span>
        </div>

        <a
          href="/auditoria"
          className="inline-flex items-center gap-1 font-mono text-xs font-medium text-slate-600 transition-colors hover:text-primary"
        >
          Ver registro de auditoría →
        </a>
      </div>
    </section>
  );
}