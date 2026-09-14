import type { CategoryStat } from "../types/dashboard";

interface CategoryDistributionProps {
  categories: CategoryStat[];
}

export function CategoryDistribution({
  categories,
}: CategoryDistributionProps) {
  const visibleCategories = categories.slice(0, 6);

  const maxProducts =
    visibleCategories.length > 0
      ? visibleCategories[0].productCount
      : 0;

  return (
    <section className="rounded-xl border border-[#e5e7ef] bg-white p-5">
      <div>
        <h2 className="font-semibold text-[#0b1c30]">
          Distribución por categorías
        </h2>

        <p className="mt-1 text-xs text-[#737686]">
          Productos registrados por categoría.
        </p>
      </div>

      {visibleCategories.length === 0 ? (
        <div className="py-10 text-center text-sm text-[#9a9dab]">
          No hay categorías disponibles.
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {visibleCategories.map(
            ({ category, productCount }) => {
              const percentage =
                maxProducts > 0
                  ? (productCount / maxProducts) * 100
                  : 0;

              return (
                <div key={category.id}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="truncate text-sm font-medium text-[#434655]">
                      {category.nombre}
                    </span>

                    <span className="shrink-0 font-mono text-xs text-[#737686]">
                      {productCount}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#eff4ff]">
                    <div
                      className="h-full rounded-full bg-[#2563eb] transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}