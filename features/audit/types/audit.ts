export interface Audit {
  id: number;
  usuarioId: number;
  username: string;
  accion: string;
  entidad: string;
  entidadId: number;
  datosAnt: string | null;
  datosNew: string | null;
  fecha: string;
}

export type AuditAction = "INSERT" | "UPDATE" | "DELETE";

export interface AuditFilters {
  search: string;
  entidad: string;
  accion: string;
  fecha: string;
}