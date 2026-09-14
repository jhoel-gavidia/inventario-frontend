"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  History,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { Movement, MovementType } from "../types/movement";

interface MovementTableProps {
  movements: Movement[];
}

const PAGE_SIZE = 4;

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateString));
}

export function MovementTable({ movements }: MovementTableProps) {
  const [filter, setFilter] = useState<MovementType | "ALL">("ALL");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredMovements = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return movements.filter((movement) => {
      const matchesType = filter === "ALL" || movement.tipo === filter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        movement.detalles.some((detail) =>
          detail.productoNombre.toLowerCase().includes(normalizedSearch),
        );

      return matchesType && matchesSearch;
    });
  }, [movements, filter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovements.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function changeFilter(value: MovementType | "ALL") {
    setFilter(value);
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function getPageNumbers() {
    return Array.from({ length: totalPages }, (_, index) => index + 1).slice(
      Math.max(0, currentPage - 3),
      currentPage + 2,
    );
  }

  return (
    <div className="space-y-4">
      {/* FILTROS */}
      <div className="rounded-xl border border-[#dce9ff] bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-fit items-center gap-1 rounded-lg bg-[#eff4ff] p-1">
            {[
              {
                value: "ALL" as const,
                label: "Todos",
              },
              {
                value: "ENTRADA" as const,
                label: "Entradas",
              },
              {
                value: "SALIDA" as const,
                label: "Salidas",
              },
            ].map((item) => {
              const active = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => changeFilter(item.value)}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-white font-semibold text-[#0b1c30] shadow-sm"
                      : "text-[#565e74] hover:text-[#0b1c30]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-[#dce9ff] bg-[#f8f9ff] px-3 lg:max-w-xs">
            <Search size={17} className="shrink-0 text-[#737686]" />

            <input
              type="text"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Buscar por repuesto..."
              className="w-full bg-transparent text-sm text-[#0b1c30] outline-none placeholder:text-[#737686]"
            />
          </div>
        </div>
      </div>

      {/* HISTORIAL */}
      <div className="overflow-hidden rounded-xl border border-[#dce9ff] bg-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#dce9ff] bg-[#eff4ff] px-5 py-3">
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#004ac6]" />

            <span className="text-sm font-semibold text-[#0b1c30]">
              Historial de movimientos
            </span>
          </div>

          <span className="text-xs text-[#565e74]">
            {filteredMovements.length}{" "}
            {filteredMovements.length === 1 ? "transacción" : "transacciones"}
          </span>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left">
            <thead className="border-b border-[#dce9ff] bg-[#f8f9ff]">
              <tr className="text-xs font-semibold uppercase tracking-wide text-[#565e74]">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Detalle de repuestos</th>
                <th className="px-5 py-3">Usuario</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eff4ff]">
              {paginatedMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-[#f8f9ff]">
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#0b1c30]">
                    #{movement.id}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-xs text-[#565e74]">
                    {formatDate(movement.fecha)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {movement.tipo === "ENTRADA" ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#eff4ff] px-2 py-1 text-xs font-semibold text-[#004ac6]">
                        <ArrowUp size={13} />
                        ENTRADA
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        <ArrowDown size={13} />
                        SALIDA
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex min-w-55 flex-col gap-1">
                      {movement.detalles.map((detail) => (
                        <div
                          key={`${movement.id}-${detail.productoId}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="truncate text-sm font-medium text-[#0b1c30]">
                            {detail.productoNombre}
                          </span>

                          <span
                            className={`shrink-0 text-xs font-bold ${
                              movement.tipo === "ENTRADA"
                                ? "text-[#004ac6]"
                                : "text-red-600"
                            }`}
                          >
                            {movement.tipo === "ENTRADA" ? "+" : "-"}
                            {detail.cantidad} u.
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563eb] text-[9px] font-bold text-white">
                        JA
                      </div>

                      <span className="text-sm text-[#565e74]">
                        Jhoelito Admin
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedMovements.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-[#565e74]"
                  >
                    No se encontraron movimientos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-[#dce9ff] bg-[#f8f9ff] px-5 py-3">
          <span className="text-xs text-[#565e74]">
            Página {currentPage} de {totalPages} ({filteredMovements.length}{" "}
            registros)
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              className="rounded-md p-1.5 text-[#565e74] hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`rounded-md px-2.5 py-1 text-xs ${
                  currentPage === pageNumber
                    ? "bg-[#2563eb] font-semibold text-white"
                    : "text-[#565e74] hover:bg-white"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
              }
              className="rounded-md p-1.5 text-[#565e74] hover:bg-white disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
