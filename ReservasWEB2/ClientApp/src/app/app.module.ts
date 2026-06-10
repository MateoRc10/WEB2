import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';

// Componentes Nuevos
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CanchasListComponent } from './components/canchas/canchas-list/canchas-list.component';
import { ReservasListComponent } from './components/reservas/reservas-list/reservas-list.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';

// Interceptor y Guards
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CanchasListComponent,
    ReservasListComponent,
    AccesoDenegadoComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, // Necesario para formularios reactivos (Login/Registro)
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      
      // Rutas públicas
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'acceso-denegado', component: AccesoDenegadoComponent },

      // Rutas protegidas (Requieren Login)
      { 
        path: 'canchas', 
        component: CanchasListComponent, 
        canActivate: [AuthGuard] // El AuthGuard verifica que el usuario tenga un token
      },
      { 
        path: 'reservas', 
        component: ReservasListComponent, 
        canActivate: [AuthGuard] 
      }
    ])
  ],
  providers: [
    // Registramos nuestro interceptor aquí para que Angular lo use en CADA petición HTTP
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // multi: true significa que podemos tener varios interceptores sin sobreescribir los de Angular
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
