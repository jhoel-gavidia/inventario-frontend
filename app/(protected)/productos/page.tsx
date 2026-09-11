"use client";
import { Download, History, Plus, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductStats } from "@/features/products/components/ProductStats";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductDrawer } from "@/features/products/components/ProductDrawer";
import { MovementModal } from "@/features/products/components/MovementModal";
import { useProducts } from "@/features/products/hooks/use-products";
import {
  createProduct,
  updateProduct,
} from "@/features/products/services/product-service";
import type {
  Product,
  ProductRequest,
} from "@/features/products/types/product";
import type { MovementType } from "@/features/movements/types/movement";
export default function ProductosPage() {
  const { products, categories, isLoading, error, refreshProducts } =
    useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementOpen, setMovementOpen] = useState(false);
  const [movementProduct, setMovementProduct] = useState<Product | null>(null);
  /* * Filtros */ const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.codigo.toLowerCase().includes(normalizedSearch) ||
        product.nombre.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        category === "ALL" || product.categoriaId === Number(category);
      const matchesStatus =
        status === "ALL" ||
        (status === "IN_STOCK" && product.stockActual > 0) ||
        (status === "OUT_OF_STOCK" && product.stockActual === 0) ||
        (status === "ACTIVO" && product.estado) ||
        (status === "INACTIVO" && !product.estado);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);
  /* * Estadísticas */ const totalProducts = products.length;
  const outOfStock = products.filter(
    (product) => product.stockActual === 0,
  ).length;
  const inventoryValue = products.reduce(
    (total, product) => total + product.precioCompra * product.stockActual,
    0,
  );
  /* * Distribución por categorías */ const categoryDistribution =
    useMemo(() => {
      const totalStock = products.reduce(
        (total, product) => total + product.stockActual,
        0,
      );
      return categories.map((category) => {
        const unidades = products
          .filter((product) => product.categoriaId === category.id)
          .reduce((total, product) => total + product.stockActual, 0);
        const porcentaje =
          totalStock > 0 ? Math.round((unidades / totalStock) * 100) : 0;
        return {
          id: category.id,
          nombre: category.nombre,
          unidades,
          porcentaje,
        };
      });
    }, [products, categories]);
  /* * Crear producto */ function handleCreate() {
    setSelectedProduct(null);
    setDrawerOpen(true);
  }
  /* * Editar producto */ function handleEdit(product: Product) {
    setSelectedProduct(product);
    setDrawerOpen(true);
  }
  /* * Cerrar drawer */ function handleCloseDrawer() {
    setDrawerOpen(false);
    setSelectedProduct(null);
  }
  /* * Guardar producto */ async function handleSaveProduct(
    data: ProductRequest,
  ) {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, data);
    } else {
      await createProduct(data);
    }
    await refreshProducts();
    handleCloseDrawer();
  }
  /* * Abrir movimientos */ function handleMovement(product: Product) {
    setMovementProduct(product);
    setMovementOpen(true);
  }
  /* * Registrar movimiento * * La lógica real de stock NO se ejecuta * aquí. El backend es responsable de: * * - incrementar stock en ENTRADA * - decrementar stock en SALIDA * - validar stock suficiente * - registrar auditoría */ async function handleMovementConfirm(
    product: Product,
    type: MovementType,
    quantity: number,
  ) {
    console.log("Movimiento pendiente de conectar:", {
      product,
      type,
      quantity,
    }); /* * Cuando conectemos el endpoint de movimientos: * * await createMovement({ * tipo: type, * detalles: [ * { * productoId: product.id, * cantidad: quantity, * }, * ], * }); * * await refreshProducts(); * setMovementOpen(false); */
  }
  return (
    <div className="w-full px-6 py-8 lg:px-8">
      
      <div className="flex flex-col gap-6">
        
        {/* ========================= LOADING ========================== */}
        {isLoading && (
          <div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-secondary shadow-sm">
            
            Cargando productos...
          </div>
        )}
        {/* ========================= ERROR ========================== */}
        {error && !isLoading && (
          <div className="rounded-xl bg-red-50 p-6 text-sm text-red-600">
            
            No se pudieron cargar los productos.
          </div>
        )}
        {!isLoading && !error && (
          <>
            
            {/* ========================= STATS ========================== */}
            <ProductStats
              totalProducts={totalProducts}
              totalCategories={categories.length}
              outOfStock={outOfStock}
              inventoryValue={inventoryValue}
            />
            {/* ========================= HEADER ========================== */}
            <section className="flex flex-col justify-between gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-sm lg:flex-row lg:items-center">
              
              <div>
                
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                  
                  Catálogo de Repuestos
                </h1>
                <p className="mt-2 text-sm text-secondary">
                  
                  Gestión de inventario de repuestos para mototaxis y servicios
                  de taller.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  
                  <Download size={18} /> Exportar Lista
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-container"
                >
                  
                  <Plus size={20} /> Crear Producto
                </button>
              </div>
            </section>
            {/* ========================= FILTERS ========================== */}
            <ProductFilters
              search={search}
              category={category}
              status={status}
              totalResults={filteredProducts.length}
              categories={categories}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onStatusChange={setStatus}
            />
            {/* ========================= TABLE ========================== */}
            <ProductTable
              products={filteredProducts}
              categories={categories}
              onEdit={handleEdit}
              onMovement={handleMovement}
            />
            {/* ========================= LOWER MODULES ========================== */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              
              {/* DISTRIBUCIÓN */}
              <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
                
                <div className="mb-6 flex items-center justify-between">
                  
                  <h2 className="font-semibold text-on-surface">
                    
                    Distribución por Categorías
                  </h2>
                  <span className="font-mono text-[11px] font-semibold text-primary">
                    
                    {categories.length} Categorías
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  
                  {categoryDistribution.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1">
                      
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        
                        <span> {item.nombre} </span>
                        <span className="font-bold text-primary">
                          
                          {item.unidades} u. ( {item.porcentaje} %)
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low">
                        
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${item.porcentaje}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-secondary">
                      
                      No hay categorías registradas.
                    </p>
                  )}
                </div>
              </section>
              {/* ECONOMIC */}
              <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
                
                <div className="flex items-center justify-between">
                  
                  <div>
                    
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                      
                      Resumen Económico
                    </span>
                    <h2 className="mt-1 font-semibold text-on-surface">
                      
                      Valor en Inventario
                    </h2>
                  </div>
                  <WalletCards size={20} className="text-primary" />
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  
                  <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                    
                    <span className="text-sm text-secondary">
                      
                      Costo Total en Almacén:
                    </span>
                    <span className="font-mono text-xs font-bold">
                      
                      S/
                      {inventoryValue.toLocaleString("es-PE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                    
                    <span className="text-sm text-secondary">
                      
                      Proyección de Venta:
                    </span>
                    <span className="font-mono text-xs font-bold text-primary">
                      
                      S/
                      {products
                        .reduce(
                          (total, product) =>
                            total + product.precioVenta * product.stockActual,
                          0,
                        )
                        .toLocaleString("es-PE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </span>
                  </div>
                </div>
              </section>
              {/* AUDIT */}
              <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
                
                <div className="flex items-center justify-between">
                  
                  <div>
                    
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                      
                      Auditoría Reciente
                    </span>
                    <h2 className="mt-1 font-semibold text-on-surface">
                      
                      Últimos Cambios
                    </h2>
                  </div>
                  <History size={20} className="text-secondary" />
                </div>
                <div className="mt-6 rounded-xl bg-surface-container-low p-4">
                  
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-primary">
                    
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Información de auditoría
                  </div>
                  <p className="mt-2 text-sm font-medium text-on-surface">
                    
                    Las operaciones de productos se registran
                    automáticamente.
                  </p>
                  <span className="mt-1 block font-mono text-[11px] text-secondary">
                    
                    Sistema de auditoría
                  </span>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
      {/* ========================= DRAWER ========================== */}
      <ProductDrawer
        key={selectedProduct?.id ?? "new"}
        open={drawerOpen}
        product={selectedProduct}
        categories={categories}
        onClose={handleCloseDrawer}
        onSave={handleSaveProduct}
      />
      {/* ========================= MOVEMENT MODAL ========================== */}
      <MovementModal
        open={movementOpen}
        product={movementProduct}
        onClose={() => setMovementOpen(false)}
        onConfirm={handleMovementConfirm}
      />
    </div>
  );
}
