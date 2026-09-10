import {
  AlertCircle,
  Boxes,
  CircleDollarSign,
  Tags,
} from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  totalCategories: number;
  outOfStock: number;
  inventoryValue: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
}

export function ProductStats({
  totalProducts,
  totalCategories,
  outOfStock,
  inventoryValue,
}: ProductStatsProps) {
  const stats = [
    {
      label: "Total Productos",
      value: totalProducts,
      description: "Repuestos registrados",
      icon: Boxes,
      danger: false,
    },
    {
      label: "Categorías",
      value: totalCategories,
      description: "Familias activas",
      icon: Tags,
      danger: false,
    },
    {
      label: "Sin Stock",
      value: outOfStock,
      description: "Repuestos agotados",
      icon: AlertCircle,
      danger: true,
    },
    {
      label: "Valor Inventario",
      value: formatCurrency(inventoryValue),
      description: "Valorización total",
      icon: CircleDollarSign,
      danger: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-6 shadow-sm"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-secondary">
                {stat.label}
              </span>

              <span
                className={`mt-1 text-2xl font-bold tracking-tight ${
                  stat.danger ? "text-red-600" : "text-on-surface"
                }`}
              >
                {stat.value}
              </span>

              <span
                className={`mt-1 font-mono text-[11px] ${
                  stat.danger ? "text-red-600" : "text-secondary"
                }`}
              >
                {stat.description}
              </span>
            </div>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                stat.danger
                  ? "bg-red-50 text-red-600"
                  : "bg-surface-container-low text-primary"
              }`}
            >
              <Icon size={26} />
            </div>
          </div>
        );
      })}
    </div>
  );
}