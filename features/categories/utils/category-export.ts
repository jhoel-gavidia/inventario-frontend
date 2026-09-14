import type { Category } from "../types/category";

export interface CategoryExportRow {
  category: Category;
  productCount: number;
}

function escapeCSV(value: unknown): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function buildCategoriesCSV(
  rows: CategoryExportRow[],
): string {
  const headers = [
    "ID",
    "Nombre",
    "Repuestos Asociados",
  ];

  const csvRows = rows.map(({ category, productCount }) => [
    category.id,
    category.nombre,
    productCount,
  ]);

  return [
    headers.map(escapeCSV).join(","),
    ...csvRows.map((row) =>
      row.map(escapeCSV).join(","),
    ),
  ].join("\n");
}

export function downloadCategoriesCSV(
  rows: CategoryExportRow[],
  filename: string,
): void {
  const csv = `\uFEFF${buildCategoriesCSV(rows)}`;

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