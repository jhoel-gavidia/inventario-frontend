export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  categoriaId: number;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  estado: boolean;
}

export interface ProductRequest {
  codigo: string;
  nombre: string;
  categoriaId: number;
  precioCompra: number;
  precioVenta: number;
  stockInicial: number;
  estado: boolean;
}