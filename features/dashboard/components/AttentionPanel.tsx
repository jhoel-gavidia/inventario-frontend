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
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Requiere atención
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Productos actualmente agotados
          </p>
        </div>

        <AlertTriangle className="h-5 w-5 text-amber-500" />
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-lg bg-slate-50 p-4 text-center">
          <p className="text-sm font-medium text-slate-700">
            Todo en orden
          </p>

          <p className="mt-1 text-xs text-slate-500">
            No hay productos agotados.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-slate-100">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/productos?search=${encodeURIComponent(
                product.nombre,
              )}`}
              className="flex items-center justify-between gap-4 py-3 transition hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {product.nombre}
                </p>

                <p className="mt-0.5 font-mono text-xs text-slate-400">
                  {product.codigo}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}