// Estas interfaces definen la estructura exacta de los datos que enviamos y recibimos del Backend.
// Esto ayuda a TypeScript a autocompletar el código y evitar errores (ej. escribir mal una propiedad).

// Usada para el formulario de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Usada para el formulario de registro
export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

// Usada para leer la respuesta del backend cuando el login es exitoso
export interface AuthResponse {
  token: string;
  role: string;
  nombre: string;
}
