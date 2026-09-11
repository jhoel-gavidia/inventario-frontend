import {
  Boxes,
  FolderTree,
  PackageX,
  Wallet,
} from "lucide-react";

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
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className="rounded-xl border border-surface-container-low bg-surface-container-lowest p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-secondary">
                  {stat.label}
                </p>

                <p
                  className={`mt-2 text-xl font-semibold tracking-tight ${
                    stat.danger
                      ? "text-red-600"
                      : "text-on-surface"
                  }`}
                >
                  {stat.value}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-secondary">
                <Icon size={18} />
              </div>
            </div>

            <p className="mt-3 text-xs text-secondary">
              {stat.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}