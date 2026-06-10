import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  isLoggedIn = false;
  userRole: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Nos "suscribimos" a la variable isLoggedIn$ del servicio.
    // Esto significa que cada vez que el usuario haga login o logout,
    // esta variable se actualizará automáticamente y la barra de navegación cambiará en tiempo real.
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.userRole = this.authService.getRole();
    });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authService.logout();
  }
}
