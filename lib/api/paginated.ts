import { api } from "./axios";

export interface PaginaResponse<T> {
  contenido: T[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
  primera: boolean;
  ultima: boolean;
}

const PAGE_SIZE = 100;

export async function getPagina<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<PaginaResponse<T>> {
  const { data } = await api.get<PaginaResponse<T>>(url, { params });

  return data;
}

export async function getAllPages<T>(url: string): Promise<T[]> {
  const first = await api.get<PaginaResponse<T>>(url, {
    params: { pagina: 0, tamano: PAGE_SIZE },
  });

  const items = [...first.data.contenido];

  for (let pagina = 1; pagina < first.data.totalPaginas; pagina += 1) {
    const next = await api.get<PaginaResponse<T>>(url, {
      params: { pagina, tamano: PAGE_SIZE },
    });

    items.push(...next.data.contenido);
  }

  return items;
}
