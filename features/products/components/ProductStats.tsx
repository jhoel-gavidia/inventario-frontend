import { Boxes, FolderTree, PackageX, Wallet } from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  totalCategories: number;
  outOfStock: number;
  inventoryValue: number;
}

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function ProductStats({
  totalProducts,
  totalCategories,
  outOfStock,
  inventoryValue,
}: ProductStatsProps) {
  const stats = [
    {
      label: "Productos",
      value: totalProducts,
      description: "Productos registrados",
      icon: Boxes,
    },
    {
      label: "Categorías",
      value: totalCategories,
      description: "Categorías registradas",
      icon: FolderTree,
    },
    {
      label: "Sin stock",
      value: outOfStock,
      description: "Requieren reposición",
      icon: PackageX,
      danger: outOfStock > 0,
    },
    {
      label: "Valor del inventario",
      value: currencyFormatter.format(inventoryValue),
      description: "Valor a precio de compra",
      icon: Wallet,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="rounded-xl border border-line bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-muted">
                  {stat.label}
                </p>

                <p
                  className={`mt-2 font-mono text-2xl font-semibold tracking-tight ${
                    stat.danger
                      ? "text-error"
                      : "text-on-surface"
                  }`}
                >
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-outline">
                  {stat.description}
                </p>
              </div>

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  stat.danger
                    ? "bg-error-soft text-error"
                    : "bg-surface-container-low text-primary-container"
                }`}
              >
                <Icon size={19} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}