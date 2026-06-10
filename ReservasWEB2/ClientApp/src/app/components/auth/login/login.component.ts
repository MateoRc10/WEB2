// ================================================================
// login.component.ts — Componente de Inicio de Sesión
// ================================================================
// Este componente maneja el formulario de login.
// Usa "Formularios Reactivos" de Angular, que son más poderosos
// que los formularios template porque permiten validaciones complejas
// y acceso programático desde el TypeScript.
//
// FLUJO COMPLETO DEL LOGIN:
// 1. Usuario escribe email y contraseña en el form HTML
// 2. Al hacer submit, llamamos a AuthService.login()
// 3. AuthService hace POST a /api/auth/login en el backend .NET
// 4. El backend verifica BCrypt y devuelve un JWT Token
// 5. AuthService guarda el token en localStorage
// 6. Redirigimos al usuario a /canchas
// ================================================================
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // ============================================================
  // PROPIEDADES DEL COMPONENTE
  // ============================================================

  // FormGroup: es el objeto que representa TODO el formulario.
  // Contiene cada campo (FormControl) con sus valores y estado de validación.
  loginForm: FormGroup;

  // Controla si se muestra el spinner de carga mientras espera al backend.
  // true = mostramos spinner y deshabilitamos el botón.
  isLoading: boolean = false;

  // Mensaje de error para mostrar al usuario si el login falla.
  // Ejemplo: "Credenciales inválidas" o "Error de conexión".
  errorMessage: string = '';

  // Controla si la contraseña es visible (ojo abierto) o no (ojo cerrado).
  // false = contraseña oculta (tipo="password"), true = visible (tipo="text")
  showPassword: boolean = false;

  // Constructor: Angular inyecta automáticamente estos servicios.
  // FormBuilder: utilidad para crear formularios reactivos fácilmente.
  // AuthService: nuestro servicio que llama a la API.
  // Router: para navegar a otra página después del login exitoso.
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // ============================================================
    // DEFINICIÓN DEL FORMULARIO REACTIVO
    // ============================================================
    // fb.group() crea el FormGroup con sus campos y validadores.
    // Cada campo es un array: [valorInicial, [validadores...]]
    this.loginForm = this.fb.group({
      // Campo email:
      // - Valor inicial vacío: ''
      // - Validators.required: no puede estar vacío
      // - Validators.email: debe tener formato de email (con @ y dominio)
      email: ['', [Validators.required, Validators.email]],

      // Campo contraseña:
      // - Valor inicial vacío: ''
      // - Validators.required: no puede estar vacío
      password: ['', Validators.required]
    });
  }

  // ============================================================
  // GETTER: Acceso rápido a los campos del formulario
  // ============================================================
  // Los "getters" nos evitan escribir: this.loginForm.get('email')
  // cada vez que queremos verificar si un campo tiene error.
  // En el HTML podemos usar simplemente: f.email.invalid
  get f() {
    return this.loginForm.controls;
  }

  // ============================================================
  // TOGGLE DE VISIBILIDAD DE CONTRASEÑA
  // ============================================================
  // Cuando el usuario hace clic en el ícono de ojo en el HTML,
  // este método invierte el estado: visible → oculto → visible...
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // ============================================================
  // MÉTODO PRINCIPAL: onSubmit()
  // ============================================================
  // Angular llama a este método cuando el usuario hace submit al formulario
  // (presiona el botón o da Enter). Lo enlazamos en HTML con (ngSubmit).
  onSubmit() {

    // VALIDACIÓN PREVENTIVA:
    // Si el formulario tiene errores (campo vacío, email inválido, etc.),
    // NO enviamos nada al backend. "return" detiene la ejecución aquí.
    if (this.loginForm.invalid) return;

    // Limpiamos cualquier error anterior de intentos previos
    this.errorMessage = '';

    // Activamos el estado de carga para mostrar el spinner en el botón
    this.isLoading = true;

    // ============================================================
    // LLAMADA AL SERVICIO DE AUTENTICACIÓN
    // ============================================================
    // authService.login() envía un POST a /api/auth/login con { email, password }.
    // .subscribe() es como "escuchar la respuesta" — funciona así:
    //   - next: se ejecuta si todo salió bien (código HTTP 200)
    //   - error: se ejecuta si algo falló (código HTTP 401, 500, etc.)
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // ✅ LOGIN EXITOSO
        // El AuthService ya guardó el token en localStorage automáticamente
        // (gracias al operador tap() que pusimos en auth.service.ts).
        // Solo necesitamos redirigir al usuario a la pantalla de canchas.
        this.isLoading = false;
        this.router.navigate(['/canchas']);
      },
      error: (err) => {
        // ❌ LOGIN FALLIDO
        // Apagamos el spinner
        this.isLoading = false;
        // Mostramos el mensaje de error del backend, o uno genérico si no lo hay
        this.errorMessage = err.error?.mensaje || 'Credenciales incorrectas. Verifica tu email y contraseña.';
      }
    });
  }
}
