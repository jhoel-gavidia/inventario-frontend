"use client";

import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpFromLine,
  History,
  Search,
  Scale,
} from "lucide-react";
import { Suspense, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { MovementForm } from "@/features/movements/components/MovementForm";
import { useMovements } from "@/features/movements/hooks/use-movements";
import type {
  Movement,
  MovementType,
} from "@/features/movements/types/movement";
import { useProducts } from "@/features/products/hooks/use-products";

const PAGE_SIZE = 5;

type MovementDetailRow = {
  movement: Movement;
  productoId: number;
  productoNombre: string;
  codigo: string;
  cantidad: number;
};

export default function MovimientosPage() {
  return (
    <Suspense fallback={null}>
      <MovimientosPageContent />
    </Suspense>
  );
}

function MovimientosPageContent() {
  const searchParams = useSearchParams();

  const movementAction = searchParams.get("action");

  const initialMovementType: MovementType | undefined =
    movementAction === "salida"
      ? "SALIDA"
      : movementAction === "entrada"
        ? "ENTRADA"
        : undefined;

  const {
    movements,
    isLoading: isLoadingMovements,
    error: movementsError,
    refreshMovements,
  } = useMovements();

  const { products, isLoading: isLoadingProducts } = useProducts();

  const [filter, setFilter] = useState<"TODOS" | MovementType>("TODOS");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const todayMovements = useMemo(() => {
    const today = new Date();

    return movements.filter((movement) => {
      const date = new Date(movement.fecha);

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    });
  }, [movements]);

  const totalEntradas = useMemo(() => {
    return todayMovements
      .filter((movement) => movement.tipo === "ENTRADA")
      .reduce(
        (total, movement) =>
          total +
          movement.detalles.reduce(
            (detailTotal, detail) => detailTotal + detail.cantidad,
            0,
          ),
        0,
      );
  }, [todayMovements]);

  const totalSalidas = useMemo(() => {
    return todayMovements
      .filter((movement) => movement.tipo === "SALIDA")
      .reduce(
        (total, movement) =>
          total +
          movement.detalles.reduce(
            (detailTotal, detail) => detailTotal + detail.cantidad,
            0,
          ),
        0,
      );
  }, [todayMovements]);

  const balanceNeto = totalEntradas - totalSalidas;

  const filteredRows = useMemo<MovementDetailRow[]>(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return movements
      .filter((movement) => {
        if (filter === "TODOS") {
          return true;
        }

        return movement.tipo === filter;
      })
      .flatMap((movement) =>
        movement.detalles.map((detail) => {
          const product = productMap.get(detail.productoId);

          return {
            movement,
            productoId: detail.productoId,
            productoNombre: detail.productoNombre,
            cantidad: detail.cantidad,
            codigo: product?.codigo ?? "",
          };
        }),
      )
      .filter((row) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          row.productoNombre.toLowerCase().includes(normalizedSearch) ||
          row.codigo.toLowerCase().includes(normalizedSearch) ||
          String(row.productoId).includes(normalizedSearch)
        );
      });
  }, [movements, filter, search, productMap]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;

    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, safeCurrentPage]);

  function handleFilterChange(nextFilter: "TODOS" | MovementType) {
    setFilter(nextFilter);
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function getMovementCode(id: number) {
    return `#MOV-${String(id).padStart(4, "0")}`;
  }

  const isLoading = isLoadingMovements || isLoadingProducts;

  return (
    <main className="min-h-full bg-background px-4 py-6 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Movimientos
            </h1>
            <p className="mt-1 text-sm text-outline">
              Registra y consulta las entradas y salidas de stock.
            </p>
          </div>
        </div>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            icon={<ArrowDownToLine size={19} />}
            label="Entradas de hoy"
            value={totalEntradas}
            description="Unidades ingresadas"
          />

          <MetricCard
            icon={<ArrowUpFromLine size={19} />}
            label="Salidas de hoy"
            value={totalSalidas}
            description="Unidades retiradas"
          />

          <MetricCard
            icon={<Scale size={19} />}
            label="Balance del día"
            value={balanceNeto}
            description="Entradas menos salidas"
          />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="min-w-0 rounded-xl border border-line bg-white xl:col-span-7">
            <div className="border-b border-line-soft px-5 py-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-primary-container">
                    <History size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold">Historial de movimientos</h2>
                    <p className="text-xs text-outline">
                      Consulta las operaciones registradas.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex rounded-lg border border-line bg-background p-1">
                    <FilterButton
                      active={filter === "TODOS"}
                      onClick={() => handleFilterChange("TODOS")}
                    >
                      Todos
                    </FilterButton>

                    <FilterButton
                      active={filter === "ENTRADA"}
                      onClick={() => handleFilterChange("ENTRADA")}
                    >
                      Entradas
                    </FilterButton>

                    <FilterButton
                      active={filter === "SALIDA"}
                      onClick={() => handleFilterChange("SALIDA")}
                    >
                      Salidas
                    </FilterButton>
                  </div>

                  <div className="relative w-full md:max-w-xs">
                    <Search
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                    />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) =>
                        handleSearchChange(event.target.value)
                      }
                      placeholder="Buscar por código o repuesto..."
                      className="h-10 w-full rounded-lg border border-line-strong bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary-container focus:ring-2 focus:ring-primary-container/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {movementsError ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-error">{movementsError}</p>

                <button
                  type="button"
                  onClick={() => void refreshMovements()}
                  className="mt-3 text-sm font-medium text-primary-container hover:underline"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-162.5 text-left">
                    <thead>
                      <tr className="border-b border-line-soft text-xs uppercase tracking-wide text-outline">
                        <th className="px-5 py-3 font-medium">Código</th>
                        <th className="px-5 py-3 font-medium">Fecha</th>
                        <th className="px-5 py-3 font-medium">Tipo</th>
                        <th className="px-5 py-3 font-medium">Repuesto</th>
                        <th className="px-5 py-3 text-right font-medium">
                          Cantidad
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-line-faint">
                      {isLoading ? (
                        <LoadingRows />
                      ) : paginatedRows.length > 0 ? (
                        paginatedRows.map((row) => (
                          <tr
                            key={`${row.movement.id}-${row.productoId}`}
                            className="transition hover:bg-surface-hover"
                          >
                            <td className="px-5 py-4 font-mono text-xs font-medium text-ink-muted">
                              {getMovementCode(row.movement.id)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-ink-muted">
                              {formatDate(row.movement.fecha)}
                            </td>

                            <td className="px-5 py-4">
                              <MovementBadge tipo={row.movement.tipo} />
                            </td>

                            <td className="px-5 py-4">
                              <div className="max-w-57.5">
                                <p className="truncate text-sm font-medium text-on-surface">
                                  {row.productoNombre}
                                </p>

                                {row.codigo && (
                                  <p className="mt-0.5 font-mono text-xs text-outline">
                                    {row.codigo}
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <span
                                className={`font-mono text-sm font-semibold ${
                                  row.movement.tipo === "ENTRADA"
                                    ? "text-success"
                                    : "text-error"
                                }`}
                              >
                                {row.movement.tipo === "ENTRADA" ? "+" : "-"}
                                {row.cantidad}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-5 py-14 text-center">
                            <div className="mx-auto flex max-w-sm flex-col items-center">
                              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-soft text-outline">
                                <History size={18} />
                              </div>

                              <p className="text-sm font-medium">
                                No hay movimientos
                              </p>

                              <p className="mt-1 text-xs text-outline">
                                No se encontraron movimientos con los filtros
                                actuales.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-line-soft px-5 py-4">
                  <p className="text-xs text-outline">
                    {filteredRows.length === 0
                      ? "0 registros"
                      : `${(safeCurrentPage - 1) * PAGE_SIZE + 1}-${Math.min(
                          safeCurrentPage * PAGE_SIZE,
                          filteredRows.length,
                        )} de ${filteredRows.length} registros`}
                  </p>

                  <div className="flex items-center gap-1">
                    <PaginationButton
                      disabled={safeCurrentPage <= 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      ariaLabel="Página anterior"
                    >
                      <ArrowLeft size={15} />
                    </PaginationButton>

                    <span className="px-2 text-xs font-medium text-ink-muted">
                      {safeCurrentPage} / {totalPages}
                    </span>

                    <PaginationButton
                      disabled={safeCurrentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      ariaLabel="Página siguiente"
                    >
                      <ArrowRight size={15} />
                    </PaginationButton>
                  </div>
                </div>
              </>
            )}
          </section>

          <section className="min-w-0 xl:col-span-5">
            <MovementForm
              products={products}
              initialType={initialMovementType}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-muted">{label}</p>

          <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-outline">{description}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-primary-container">
          {icon}
        </div>
      </div>
    </article>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-white text-primary-container shadow-sm"
          : "text-outline hover:text-ink-muted"
      }`}
    >
      {children}
    </button>
  );
}

function MovementBadge({ tipo }: { tipo: MovementType }) {
  const isEntry = tipo === "ENTRADA";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isEntry ? "bg-success-container text-success" : "bg-error-soft text-error"
      }`}
    >
      {isEntry ? <ArrowDownToLine size={13} /> : <ArrowUpFromLine size={13} />}

      {isEntry ? "Entrada" : "Salida"}
    </span>
  );
}

function PaginationButton({
  disabled,
  onClick,
  children,
  ariaLabel,
}: {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink-muted transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <tr key={index}>
          <td className="px-5 py-4" colSpan={5}>
            <div className="h-5 animate-pulse rounded bg-neutral-soft" />
          </td>
        </tr>
      ))}
    </>
  );
}
