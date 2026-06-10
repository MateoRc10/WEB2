// Estructura de una Cancha
export interface Cancha {
  id: number;
  nombre: string;
  descripcion: string;
  precioPorHora: number;
}

// Estructura para crear o editar una cancha (no enviamos el Id)
export interface CanchaCreateUpdate {
  nombre: string;
  descripcion: string;
  precioPorHora: number;
}

// Interfaz para mapear la respuesta paginada del backend
export interface PaginatedCanchas {
  totalItems: number;
  page: number;
  pageSize: number;
  items: Cancha[];
}
