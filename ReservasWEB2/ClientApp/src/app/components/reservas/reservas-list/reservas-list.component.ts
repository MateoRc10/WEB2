// ================================================================
// reservas-list.component.ts — Lista de Reservas
// ================================================================
// Muestra las reservas hechas en la plataforma.
// - Admin: ve TODAS las reservas (con el nombre del cliente)
// - Cliente: ve SOLO SUS reservas
// ================================================================
import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service';
import { AuthService } from '../../../services/auth.service';
import { Reserva } from '../../../models/reserva';

@Component({
  selector: 'app-reservas-list',
  templateUrl: './reservas-list.component.html',
  styleUrls: ['./reservas-list.component.css']
})
export class ReservasListComponent implements OnInit {

  reservas: Reserva[] = [];
  isLoading: boolean = false;
  userRole: string | null = '';
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private reservasService: ReservasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.isLoading = true;
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.mostrarError('Error al cargar las reservas.');
      }
    });
  }

  // Cancelar (Soft Delete) una reserva
  cancelarReserva(id: number): void {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

    this.reservasService.cancelarReserva(id).subscribe({
      next: () => {
        this.mostrarExito('Reserva cancelada exitosamente.');
        this.cargarReservas(); // Recargar la tabla
      },
      error: (err) => {
        this.mostrarError(err.error?.mensaje || 'Error al cancelar la reserva.');
      }
    });
  }

  // Formatea la fecha ISO a un formato más legible
  formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleString('es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Muestra mensaje de éxito por 3.5 segundos
  private mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mensajeError = '';
    setTimeout(() => this.mensajeExito = '', 3500);
  }

  // Muestra mensaje de error por 4 segundos
  private mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.mensajeExito = '';
    setTimeout(() => this.mensajeError = '', 4000);
  }
}
