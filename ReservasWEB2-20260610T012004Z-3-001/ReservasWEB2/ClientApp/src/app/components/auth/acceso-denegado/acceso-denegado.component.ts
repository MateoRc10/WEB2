// ================================================================
// acceso-denegado.component.ts — Pantalla de Acceso Denegado (403)
// ================================================================
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-acceso-denegado',
  templateUrl: './acceso-denegado.component.html',
  styleUrls: ['./acceso-denegado.component.css']
})
export class AccesoDenegadoComponent {
  
  // Location es un servicio de Angular que nos permite interactuar 
  // con el historial del navegador (como los botones de Atrás/Adelante)
  constructor(private location: Location) {}

  volver(): void {
    // Regresa a la página anterior en el historial
    this.location.back();
  }
}
