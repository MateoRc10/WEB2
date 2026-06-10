import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // Este Guard protege rutas específicas que requieren un ROL en particular (ej. Solo Admin).
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    // Obtenemos el rol que exige la ruta (lo configuraremos en app.routes.ts)
    const expectedRole = route.data['expectedRole'];
    
    // Obtenemos el rol actual del usuario logueado
    const currentRole = this.authService.getRole();

    // Si no está logueado, o su rol no coincide con el exigido...
    if (!currentRole || currentRole !== expectedRole) {
      // Lo mandamos a una vista de "Acceso Denegado"
      this.router.navigate(['/acceso-denegado']);
      return false; // Bloqueamos el paso
    }

    return true; // Si coinciden, le damos paso verde.
  }
}
