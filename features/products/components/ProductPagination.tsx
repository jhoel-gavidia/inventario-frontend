"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ProductPaginationProps) {
  const firstItem =
    totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const lastItem = Math.min(currentPage * pageSize, totalItems);

  const pages = getPageNumbers(currentPage, totalPages);

  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex flex-col gap-4 border-t border-surface-container-low bg-surface-container-lowest px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-secondary">
        Mostrando{" "}
        <span className="font-medium text-on-surface">
          {firstItem}-{lastItem}
        </span>{" "}
        de{" "}
        <span className="font-medium text-on-surface">
          {totalItems}
        </span>{" "}
        productos
      </p>

      {totalPages > 1 && (
        <nav
          aria-label="Paginación de productos"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPrevious}
            aria-label="Página anterior"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-container-low bg-white text-secondary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            {pages.map((page, index) =>
              typeof page === "string" ? (
                <span
                  key={`${page}-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-secondary"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <span className="px-2 text-sm font-medium text-on-surface sm:hidden">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNext}
            aria-label="Página siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-container-low bg-white text-secondary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </nav>
      )}
    </div>
  );
}