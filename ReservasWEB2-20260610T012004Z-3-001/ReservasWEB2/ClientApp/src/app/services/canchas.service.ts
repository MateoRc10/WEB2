import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cancha, CanchaCreateUpdate, PaginatedCanchas } from '../models/cancha';

@Injectable({
  providedIn: 'root'
})
export class CanchasService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  // PUNTOS EXTRA: Paginación y Filtro
  // Pasamos los parámetros por query string (ej: ?nombre=X&page=1&pageSize=10)
  getCanchas(nombre: string = '', page: number = 1, pageSize: number = 10): Observable<PaginatedCanchas> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (nombre) {
      params = params.set('nombre', nombre);
    }

    return this.http.get<PaginatedCanchas>(`${this.baseUrl}api/canchas`, { params });
  }

  // Obtener una sola cancha
  getCancha(id: number): Observable<Cancha> {
    return this.http.get<Cancha>(`${this.baseUrl}api/canchas/${id}`);
  }

  // Crear una cancha (Solo para Admin)
  createCancha(cancha: CanchaCreateUpdate): Observable<any> {
    return this.http.post(`${this.baseUrl}api/canchas`, cancha);
  }

  // Actualizar una cancha (Solo para Admin)
  updateCancha(id: number, cancha: CanchaCreateUpdate): Observable<any> {
    return this.http.put(`${this.baseUrl}api/canchas/${id}`, cancha);
  }

  // Eliminar una cancha (Solo para Admin)
  deleteCancha(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}api/canchas/${id}`);
  }
}
