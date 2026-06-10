import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva, ReservaCreate } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  // Trae la lista de reservas. 
  // El backend decidirá internamente si envía TODAS (si es Admin) o SOLO LAS DEL CLIENTE.
  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}api/reservas`);
  }

  // Crea una nueva reserva
  createReserva(reserva: ReservaCreate): Observable<any> {
    return this.http.post(`${this.baseUrl}api/reservas`, reserva);
  }

  // Cancela una reserva (Soft Delete)
  cancelarReserva(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}api/reservas/${id}`);
  }
}
