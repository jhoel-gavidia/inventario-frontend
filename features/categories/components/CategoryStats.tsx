import {
  Package,
  Tag,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";

interface CategoryStatsProps {
  categoryCount: number;
  productCount: number;
  highestCategory: {
    name: string;
    count: number;
  } | null;
}

export function CategoryStats({
  categoryCount,
  productCount,
  highestCategory,
}: CategoryStatsProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        icon={<Tag size={19} />}
        label="Categorías"
        value={categoryCount}
        description="Familias registradas"
      />

      <MetricCard
        icon={<Package size={19} />}
        label="Repuestos asociados"
        value={productCount}
        description="En catálogo activo"
      />

      <article className="hidden rounded-xl border border-[#e5e7ef] bg-white p-5 xl:block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#434655]">
              Categoría con más repuestos
            </p>

            <p className="mt-2 truncate text-lg font-semibold">
              {highestCategory?.name ?? "Sin datos"}
            </p>

            <p className="mt-1 text-xs text-[#2563eb]">
              {highestCategory
                ? `${highestCategory.count} repuestos vinculados`
                : "0 repuestos vinculados"}
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
            <Wrench size={19} />
          </div>
        </div>
      </article>
    </section>
  );
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  description: string;
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <article className="rounded-xl border border-[#e5e7ef] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#434655]">
            {label}
          </p>

          <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#737686]">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
          {icon}
        </div>
      </div>
    </article>
  );
}