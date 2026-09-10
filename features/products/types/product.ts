export type ProductStatus = "ACTIVO" | "INACTIVO";

export type MovementType = "ENTRADA" | "SALIDA";

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  estado: ProductStatus;
}

export interface CategoryDistribution {
  nombre: string;
  unidades: number;
  porcentaje: number;
}