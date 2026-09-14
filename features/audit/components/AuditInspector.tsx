import {
  CalendarDays,
  Copy,
  FileDiff,
  Hash,
} from "lucide-react";

import type { Audit } from "../types/audit";

interface AuditInspectorProps {
  audit: Audit | null;
}

function formatJson(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

export function AuditInspector({
  audit,
}: AuditInspectorProps) {
  if (!audit) {
    return (
      <section className="flex min-h-100 items-center justify-center rounded-xl border border-line bg-white p-6">
        <div className="max-w-xs text-center">
          <FileDiff
            size={32}
            className="mx-auto text-line-muted"
          />

          <h3 className="mt-3 text-sm font-bold text-ink-muted">
            Selecciona un registro
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-ink-faint">
            Selecciona una auditoría para inspeccionar los datos
            anteriores y nuevos.
          </p>
        </div>
      </section>
    );
  }

  const datosAnt = formatJson(audit.datosAnt);
  const datosNew = formatJson(audit.datosNew);

  const copyJson = async () => {
    const value = JSON.stringify(
      {
        id: audit.id,
        usuarioId: audit.usuarioId,
        username: audit.username,
        accion: audit.accion,
        entidad: audit.entidad,
        entidadId: audit.entidadId,
        datosAnt: audit.datosAnt,
        datosNew: audit.datosNew,
        fecha: audit.fecha,
      },
      null,
      2
    );

    await navigator.clipboard.writeText(value);
  };

  return (
    <section className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-center justify-between border-b border-line-strong pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-container-low text-primary-container">
            <FileDiff size={17} />
          </div>

          <div>
            <h3 className="text-xs font-bold text-on-surface">
              Inspector de Cambios
            </h3>

            <p className="text-[11px] text-ink-muted">
              Registro #{audit.id} · {audit.entidad} #{audit.entidadId}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyJson}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition hover:bg-surface-hover"
        >
          <Copy size={14} />

          Copiar JSON
        </button>
      </div>

      <div className="my-3 grid grid-cols-2 gap-2 rounded-lg border border-line bg-surface-tint p-2.5 text-[11px]">
        <div>
          <span className="block text-[10px] font-bold uppercase text-ink-faint">
            Operación
          </span>

          <span
            className={
              audit.accion === "DELETE"
                ? "font-bold text-error"
                : audit.accion === "INSERT"
                  ? "font-bold text-success"
                  : "font-bold text-warning"
            }
          >
            {audit.accion}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase text-ink-faint">
            Usuario
          </span>

          <span className="font-semibold text-on-surface">
            {audit.username} · #{audit.usuarioId}
          </span>
        </div>

        <div>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-ink-faint">
            <CalendarDays size={12} />

            Fecha
          </span>

          <span className="font-mono text-ink-muted">
            {formatDate(audit.fecha)}
          </span>
        </div>

        <div>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-ink-faint">
            <Hash size={12} />

            Entidad
          </span>

          <span className="font-semibold text-ink-muted">
            {audit.entidad} #{audit.entidadId}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <JsonBox
          title="Datos anteriores"
          value={datosAnt}
          variant="before"
        />

        <JsonBox
          title="Datos nuevos"
          value={datosNew}
          variant="after"
        />
      </div>
    </section>
  );
}

interface JsonBoxProps {
  title: string;
  value: string | null;
  variant: "before" | "after";
}

function JsonBox({
  title,
  value,
  variant,
}: JsonBoxProps) {
  const styles =
    variant === "before"
      ? "border-line-error-soft bg-error-soft/40"
      : "border-success/20 bg-success-container/40";

  const headerStyles =
    variant === "before"
      ? "border-line-error-soft bg-error-soft text-error"
      : "border-success/20 bg-success-container text-success";

  return (
    <div className={`overflow-hidden rounded-lg border ${styles}`}>
      <div
        className={`border-b px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${headerStyles}`}
      >
        {title}
      </div>

      {value ? (
        <pre className="max-h-72 overflow-auto bg-white p-3 text-[11px] leading-relaxed text-ink-muted">
          {value}
        </pre>
      ) : (
        <div className="bg-white p-3 text-xs text-ink-faint">
          No hay datos registrados.
        </div>
      )}
    </div>
  );
}