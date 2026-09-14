import { Eye } from "lucide-react";

import type { Audit } from "../types/audit";

interface AuditTableProps {
  audits: Audit[];
  selectedAudit: Audit | null;
  onSelect: (audit: Audit) => void;
}

function getActionClass(action: string) {
  switch (action) {
    case "INSERT":
      return "border-success/20 bg-success-container text-success";

    case "DELETE":
      return "border-line-error-strong bg-error-container text-error";

    default:
      return "border-warning/20 bg-warning-container text-warning";
  }
}

function getInitials(username: string) {
  return username
    .split(/[._\s-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AuditTable({
  audits,
  selectedAudit,
  onSelect,
}: AuditTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line-strong bg-surface-hover px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Historial de Cambios
          </span>

          <span className="rounded-full bg-primary-container/10 px-2 py-0.5 text-[11px] font-bold text-secondary">
            {audits.length}
          </span>
        </div>
      </div>

      {audits.length === 0 ? (
        <div className="flex min-h-60 items-center justify-center p-6 text-center">
          <div>
            <p className="text-sm font-semibold text-ink-muted">
              No se encontraron registros
            </p>

            <p className="mt-1 text-xs text-ink-faint">
              Prueba cambiando los filtros.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-line-strong bg-surface-tint text-[10px] font-bold uppercase tracking-wider text-ink-faint">
              <tr>
                <th className="px-3 py-2.5">ID</th>
                <th className="px-3 py-2.5">Fecha / Hora</th>
                <th className="px-3 py-2.5">Usuario</th>
                <th className="px-3 py-2.5">Acción</th>
                <th className="px-3 py-2.5">Entidad</th>
                <th className="px-3 py-2.5 text-right">
                  Ver
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line-soft text-xs">
              {audits.map((audit) => {
                const selected =
                  selectedAudit?.id === audit.id;

                return (
                  <tr
                    key={audit.id}
                    className={
                      selected
                        ? "border-l-4 border-l-primary-container bg-surface-container-low/50"
                        : "border-l-4 border-l-transparent transition hover:bg-surface-hover"
                    }
                  >
                    <td className="whitespace-nowrap px-3 py-3 font-mono font-semibold text-ink-muted">
                      #{audit.id}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <span className="font-medium text-on-surface">
                        {formatDate(audit.fecha)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-[9px] font-bold text-white">
                          {getInitials(audit.username)}
                        </div>

                        <div>
                          <div className="font-semibold text-on-surface">
                            {audit.username}
                          </div>

                          <span className="text-[9px] text-ink-faint">
                            ID: {audit.usuarioId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <span
                        className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-bold ${getActionClass(
                          audit.accion
                        )}`}
                      >
                        {audit.accion}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="font-semibold text-on-surface">
                        {audit.entidad}
                      </div>

                      <div className="font-mono text-[10px] text-ink-faint">
                        ID: #{audit.entidadId}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelect(audit)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                          selected
                            ? "bg-primary-container text-white"
                            : "border border-line text-ink-muted hover:bg-surface-hover"
                        }`}
                      >
                        <Eye size={13} />

                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}