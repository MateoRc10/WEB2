// ================================================================
// register.component.ts — Componente de Registro de Nuevos Usuarios
// ================================================================
// Muy parecido al LoginComponent, pero con un campo más (Nombre)
// y una validación extra: confirmar que las contraseñas coincidan.
//
// FLUJO DEL REGISTRO:
// 1. Usuario llena nombre, email, contraseña y confirmación
// 2. Angular valida el formulario en tiempo real (frontend)
// 3. Al submit, llamamos a AuthService.register()
// 4. El backend crea el usuario en PostgreSQL con BCrypt Hash
// 5. El backend devuelve 200 OK con mensaje de éxito
// 6. Mostramos el mensaje y redirigimos al login después de 2 segundos
// ================================================================
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

// ================================================================
// FUNCIÓN VALIDADOR PERSONALIZADO: passwordsMatch
// ================================================================
// Angular permite crear validadores personalizados para reglas de negocio
// que no existen en la lista de Validators de Angular.
// Esta función verifica que "password" y "confirmPassword" sean iguales.
// Retorna null si son iguales (sin error), o un objeto de error si difieren.
function passwordsMatch(control: AbstractControl) {
  // AbstractControl nos da acceso al FormGroup completo
  const password = control.get('password')?.value; // Leemos el valor de "password"
  const confirm = control.get('confirmPassword')?.value; // Leemos el valor de "confirmPassword"

  // Si los valores son iguales, no hay error → retornamos null
  if (password === confirm) return null;

  // Si son distintos, retornamos un objeto de error.
  // El nombre del error ('passwordsMismatch') lo usamos en el HTML para mostrarlo.
  return { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // PROPIEDADES DEL COMPONENTE
  registerForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = ''; // Mensaje de éxito al registrar
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // ============================================================
    // DEFINICIÓN DEL FORMULARIO DE REGISTRO
    // ============================================================
    // El segundo argumento de fb.group() acepta validadores a nivel de grupo.
    // passwordsMatch se ejecuta sobre el grupo completo para comparar dos campos.
    this.registerForm = this.fb.group({

      // Campo Nombre: mínimo 3 caracteres para evitar nombres muy cortos
      nombre: ['', [Validators.required, Validators.minLength(3)]],

      // Campo Email: formato válido obligatorio
      email: ['', [Validators.required, Validators.email]],

      // Campo Contraseña: mínimo 6 caracteres (igual que el backend lo exige)
      password: ['', [Validators.required, Validators.minLength(6)]],

      // Campo Confirmar Contraseña: solo required en el control individual
      // La validación de coincidencia la hace el validador del GRUPO
      confirmPassword: ['', Validators.required]

    // El segundo argumento es la configuración del FormGroup.
    // validators: [passwordsMatch] aplica nuestra función al grupo completo.
    }, { validators: passwordsMatch });
  }

  // Getter para acceso rápido a los controles desde el HTML
  get f() {
    return this.registerForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ============================================================
  // MÉTODO PRINCIPAL: onSubmit()
  // ============================================================
  onSubmit() {
    // Verificamos que el formulario sea válido (incluye la validación del grupo passwordsMatch)
    if (this.registerForm.invalid) return;

    // Limpiamos mensajes previos
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // Preparamos el objeto con solo los datos que el backend necesita.
    // NO enviamos "confirmPassword" porque el backend no lo espera.
    const registerData = {
      nombre: this.f['nombre'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    // Llamamos al servicio de registro
    this.authService.register(registerData).subscribe({
      next: (response: any) => {
        // ✅ REGISTRO EXITOSO
        this.isLoading = false;
        this.successMessage = '¡Cuenta creada exitosamente! Redirigiendo al login...';
        // Redirigimos al login automáticamente después de 2 segundos
        // setTimeout es una función de JavaScript que ejecuta algo después de X milisegundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // 2000ms = 2 segundos
      },
      error: (err) => {
        // ❌ ERROR EN EL REGISTRO (email ya en uso, error de servidor, etc.)
        this.isLoading = false;
        this.errorMessage = err.error?.mensaje || 'Error al crear la cuenta. Intenta de nuevo.';
      }
    });
  }
}
