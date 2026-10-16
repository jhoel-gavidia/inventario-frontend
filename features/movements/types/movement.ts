export type MovementType = "ENTRADA" | "SALIDA";

export interface MovementDetail {
  productoId: number;
  productoNombre: string;
  cantidad: number;
}

export interface Movement {
  id: number;
  tipo: MovementType;
  fecha: string;
  detalles: MovementDetail[];
}

export interface MovementRequest {
  tipo: MovementType;
  detalles: MovementDetailRequest[];
}

export interface MovementDetailRequest {
  productoId: number;
  cantidad: number;
}

export interface MovementRow {
  movimientoId: number;
  fecha: string;
  tipo: MovementType;
  productoId: number;
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
}

export interface MovementResumen {
  entradasHoy: number;
  salidasHoy: number;
}

export interface MovementRowFilters {
  tipo?: MovementType;
  search?: string;
}