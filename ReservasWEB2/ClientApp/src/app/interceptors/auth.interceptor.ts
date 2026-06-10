import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  // Este método "intercepta" TODAS las peticiones HTTP que salen de Angular hacia el Backend.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // 1. Obtenemos el token guardado
    const token = this.authService.getToken();

    // 2. Si existe un token, "clonamos" la petición original y le agregamos un nuevo encabezado (Header).
    // El encabezado es 'Authorization: Bearer <token>', exactamente lo que pide nuestro backend (.NET JWT).
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 3. Dejamos que la petición continúe su camino hacia el servidor (next.handle).
    return next.handle(request).pipe(
      // 4. Si el servidor nos responde con un error, lo atrapamos aquí.
      catchError((error: HttpErrorResponse) => {
        // PUNTOS EXTRA: Si el error es 401 (No autorizado), significa que el token expiró o es inválido.
        if (error.status === 401) {
          // Cerramos la sesión limpiamente y mandamos al usuario al login.
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
