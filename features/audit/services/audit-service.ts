import { getAllPages } from "@/lib/api/paginated";
import type { Audit } from "../types/audit";

export async function getAudits(): Promise<Audit[]> {
  return getAllPages<Audit>("/auditorias");
}