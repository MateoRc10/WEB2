import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // CanActivate decide si una ruta de Angular se puede abrir o no.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    // Verificamos si el usuario tiene un token.
    if (this.authService.getToken()) {
      return true; // Si lo tiene, le damos paso verde.
    }

    // Si NO lo tiene, bloqueamos el acceso (return false) y lo redirigimos a la página de Login.
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
