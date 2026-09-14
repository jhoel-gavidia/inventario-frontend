import { api } from "@/lib/api/axios";
import type { Audit } from "../types/audit";

export async function getAudits(): Promise<Audit[]> {
  const { data } = await api.get<Audit[]>("/auditorias");

  return data;
}