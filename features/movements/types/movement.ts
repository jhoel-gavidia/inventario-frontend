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