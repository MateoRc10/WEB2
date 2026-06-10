// ================================================================
// home.component.ts — Componente de la Página de Inicio
// ================================================================
// Este es un componente muy simple porque la lógica de la home
// es básicamente solo mostrar HTML estático (no necesita llamar a la API).
// La complejidad visual está toda en el HTML y CSS.
// ================================================================
import { Component } from '@angular/core';

// @Component es un "decorador" — una función especial de Angular que
// le dice al framework: "Esta clase ES un componente de Angular".
@Component({
  // selector: el tag HTML que usamos para poner este componente en otro HTML.
  // Lo usamos como: <app-home></app-home> (aunque el router lo hace automático)
  selector: 'app-home',

  // templateUrl: la ruta al archivo HTML de este componente
  templateUrl: './home.component.html',

  // styleUrls: los archivos CSS que solo aplican a ESTE componente
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Este componente no necesita ninguna propiedad ni método adicional.
  // Todo el "comportamiento" de la home es navegación con [routerLink],
  // que Angular maneja sin necesidad de código TypeScript extra.
}
