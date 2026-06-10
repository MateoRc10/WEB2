// Estructura de la respuesta de una reserva (lo que vemos en la tabla)
export interface Reserva {
  id: number;
  canchaNombre: string;
  usuarioNombre: string;
  fechaInicio: string; // En TypeScript, las fechas que vienen de JSON se tratan como strings iniciales
  fechaFin: string;
  estado: string;
}

// Estructura para enviar una nueva reserva al backend
export interface ReservaCreate {
  canchaId: number;
  fechaInicio: string;
  fechaFin: string;
}
