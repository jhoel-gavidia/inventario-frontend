import type { Audit } from "../types/audit";

function escapeCSV(value: unknown): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function buildAuditsCSV(audits: Audit[]): string {
  const headers = [
    "ID",
    "Usuario",
    "Accion",
    "Entidad",
    "Entidad ID",
    "Fecha",
  ];

  const csvRows = audits.map((audit) => [
    audit.id,
    audit.username,
    audit.accion,
    audit.entidad,
    audit.entidadId,
    audit.fecha,
  ]);

  return [
    headers.map(escapeCSV).join(","),
    ...csvRows.map((row) =>
      row.map(escapeCSV).join(","),
    ),
  ].join("\n");
}

export function downloadAuditsCSV(
  audits: Audit[],
  filename: string,
): void {
  const csv = `\uFEFF${buildAuditsCSV(audits)}`;

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}