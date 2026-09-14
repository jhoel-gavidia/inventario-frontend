import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Product } from "@/features/products/types/product";

interface AttentionPanelProps {
  products: Product[];
}

export function AttentionPanel({
  products,
}: AttentionPanelProps) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-on-surface">
            Requiere atención
          </h2>

          <p className="mt-1 text-sm text-outline">
            Productos actualmente agotados
          </p>
        </div>

        <AlertTriangle className="h-5 w-5 text-warning" />
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-lg bg-surface-hover p-4 text-center">
          <p className="text-sm font-medium text-ink-muted">
            Todo en orden
          </p>

          <p className="mt-1 text-xs text-outline">
            No hay productos agotados.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-line-soft">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/productos?search=${encodeURIComponent(
                product.nombre,
              )}`}
              className="flex items-center justify-between gap-4 py-3 transition hover:bg-surface-hover"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-on-surface">
                  {product.nombre}
                </p>

                <p className="mt-0.5 font-mono text-xs text-ink-faint">
                  {product.codigo}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}