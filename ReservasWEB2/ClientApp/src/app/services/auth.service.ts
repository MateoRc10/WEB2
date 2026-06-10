import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // Este servicio estará disponible en toda la aplicación
})
export class AuthService {
  // BehaviorSubject es una variable "reactiva". Guarda el estado de si el usuario está logueado o no,
  // y cualquier componente puede "suscribirse" a ella para enterarse cuando cambie.
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // baseUrl es la URL de nuestro backend. Inject('BASE_URL') funciona bien en esta plantilla .NET + Angular.
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private router: Router) { }

  // Envía petición POST a /api/auth/register
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}api/auth/register`, data);
  }

  // Envía petición POST a /api/auth/login
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}api/auth/login`, data).pipe(
      // 'tap' nos permite ejecutar código "secundario" cuando la petición sea exitosa, sin alterar la respuesta.
      tap(response => {
        // Guardamos el token y el rol en el LocalStorage del navegador
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        // Notificamos a la aplicación que el usuario ya está logueado
        this.isLoggedInSubject.next(true);
      })
    );
  }

  // Limpia la sesión del usuario
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    // Redirigimos al login
    this.router.navigate(['/login']);
  }

  // Verifica si hay un token guardado
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtiene el token guardado para usarlo en las peticiones HTTP
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtiene el rol del usuario (Admin o Cliente)
  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
