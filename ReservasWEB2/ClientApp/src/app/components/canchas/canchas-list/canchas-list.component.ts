// ================================================================
// canchas-list.component.ts — Lista y Gestión de Canchas
// ================================================================
// Este es el componente más complejo del frontend.
// Para el ADMIN muestra el panel de gestión completo (CRUD).
// Para el CLIENTE muestra solo el listado con el botón de reservar.
//
// FUNCIONALIDADES:
// ✅ Listado con paginación server-side (el backend devuelve solo X registros)
// ✅ Buscador por nombre en tiempo real
// ✅ Modal de creación/edición de canchas (solo Admin)
// ✅ Confirmación de eliminación (solo Admin)
// ✅ Botón de reserva rápida (solo Cliente)
// ✅ Mensajes de éxito y error con auto-dismiss
// ================================================================
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanchasService } from '../../../services/canchas.service';
import { ReservasService } from '../../../services/reservas.service';
import { AuthService } from '../../../services/auth.service';
import { Cancha } from '../../../models/cancha';
import { ReservaCreate } from '../../../models/reserva';

@Component({
  selector: 'app-canchas-list',
  templateUrl: './canchas-list.component.html',
  styleUrls: ['./canchas-list.component.css']
})
export class CanchasListComponent implements OnInit {

  // ============================================================
  // PROPIEDADES DEL COMPONENTE
  // ============================================================

  // Array que guarda las canchas devueltas por el backend
  canchas: Cancha[] = [];

  // Variables para la PAGINACIÓN SERVER-SIDE
  totalItems: number = 0;     // Total de canchas en la BD (para calcular # de páginas)
  page: number = 1;           // Página actual (empieza en 1)
  pageSize: number = 5;       // Canchas por página

  // Texto del buscador por nombre
  searchTerm: string = '';

  // Estado de la pantalla
  isLoading: boolean = false;   // true mientras espera al backend
  userRole: string | null = ''; // 'Admin' o 'Cliente'

  // Mensajes de feedback para el usuario
  mensajeExito: string = '';
  mensajeError: string = '';

  // ============================================================
  // PROPIEDADES DEL MODAL DE CREAR/EDITAR CANCHAS (Solo Admin)
  // ============================================================

  // Controla si el modal está visible o no
  showModal: boolean = false;

  // Indica si el modal está en modo "Crear" o "Editar"
  // null = Crear nueva cancha, número = Editar la cancha con ese Id
  editingId: number | null = null;

  // Título dinámico del modal
  modalTitle: string = 'Nueva Cancha';

  // Formulario del modal
  canchaForm: FormGroup;

  // true mientras se envía el formulario del modal
  isSaving: boolean = false;

  // ============================================================
  // PROPIEDADES DEL MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
  // ============================================================
  showDeleteModal: boolean = false; // ¿Mostrar el modal de confirmar eliminación?
  deletingCancha: Cancha | null = null; // La cancha que se está intentando eliminar
  isDeleting: boolean = false; // true mientras se espera la respuesta del DELETE

  // ============================================================
  // PROPIEDADES DEL MODAL DE RESERVACIÓN
  // ============================================================
  showReservaModal: boolean = false;
  selectedCancha: Cancha | null = null;
  reservaForm: FormGroup;

  // Constructor: Angular inyecta los servicios automáticamente
  constructor(
    private fb: FormBuilder,
    private canchasService: CanchasService,
    private reservasService: ReservasService,
    private authService: AuthService
  ) {
    // Definimos el formulario de la cancha con sus validaciones
    this.canchaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.maxLength(500)],
      // Validators.min(1) = el precio debe ser mayor que 0
      precioPorHora: ['', [Validators.required, Validators.min(1)]]
    });

    // Definimos el formulario de la reserva con sus validaciones
    this.reservaForm = this.fb.group({
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    });
  }

  // ============================================================
  // ngOnInit: Se ejecuta automáticamente cuando el componente se monta
  // ============================================================
  ngOnInit(): void {
    // Obtenemos el rol del usuario desde el localStorage (guardado al hacer login)
    this.userRole = this.authService.getRole();
    // Cargamos las canchas del backend al abrir la pantalla
    this.cargarCanchas();
  }

  // Getter para acceso rápido a los controles del formulario del modal
  get f() {
    return this.canchaForm.controls;
  }

  // ============================================================
  // CARGAR CANCHAS (con paginación y búsqueda)
  // ============================================================
  // Este método llama al backend con los parámetros de búsqueda y paginación.
  // El backend devuelve SOLO las canchas de la página actual, no todas.
  cargarCanchas(): void {
    this.isLoading = true; // Activamos el spinner
    // Llamamos al servicio que hace GET /api/canchas?nombre=X&page=Y&pageSize=Z
    this.canchasService.getCanchas(this.searchTerm, this.page, this.pageSize).subscribe({
      next: (data) => {
        // La respuesta del backend tiene esta estructura:
        // { totalItems: 10, page: 1, pageSize: 5, items: [...] }
        this.canchas = data.items;        // Las canchas de ESTA página
        this.totalItems = data.totalItems; // El total global para calcular # de páginas
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.mostrarError('Error al cargar las canchas. Intenta de nuevo.');
      }
    });
  }

  // ============================================================
  // BÚSQUEDA
  // ============================================================
  buscar(): void {
    // Al buscar, siempre volvemos a la página 1 para ver los resultados desde el inicio
    this.page = 1;
    this.cargarCanchas();
  }

  // Limpia el buscador y vuelve a cargar todas las canchas
  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.page = 1;
    this.cargarCanchas();
  }

  // ============================================================
  // PAGINACIÓN
  // ============================================================
  // Calculamos el número total de páginas dividiendo totalItems / pageSize
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // Genera un array [1, 2, 3, ...] para hacer *ngFor en los botones de página
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Ir a una página específica
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.page = pagina;
      this.cargarCanchas();
    }
  }

  paginaSiguiente(): void { this.irAPagina(this.page + 1); }
  paginaAnterior(): void { this.irAPagina(this.page - 1); }

  // ============================================================
  // MODAL DE CREAR / EDITAR CANCHA (Solo Admin)
  // ============================================================

  // Abre el modal para CREAR una nueva cancha
  abrirModalCrear(): void {
    this.editingId = null; // null = modo Crear
    this.modalTitle = 'Nueva Cancha';
    this.canchaForm.reset(); // Limpia el formulario
    this.showModal = true;
  }

  // Abre el modal para EDITAR una cancha existente
  abrirModalEditar(cancha: Cancha): void {
    this.editingId = cancha.id; // Guardamos el Id de la cancha a editar
    this.modalTitle = 'Editar Cancha';
    // Llenamos el formulario con los datos actuales de la cancha
    this.canchaForm.patchValue({
      nombre: cancha.nombre,
      descripcion: cancha.descripcion,
      precioPorHora: cancha.precioPorHora
    });
    this.showModal = true;
  }

  // Cierra el modal
  cerrarModal(): void {
    this.showModal = false;
    this.editingId = null;
    this.canchaForm.reset();
  }

  // Guarda (Crear o Editar) dependiendo de editingId
  guardarCancha(): void {
    if (this.canchaForm.invalid) return;
    this.isSaving = true;

    const datos = this.canchaForm.value;

    if (this.editingId === null) {
      // ===== MODO CREAR =====
      // Llamamos a POST /api/canchas
      this.canchasService.createCancha(datos).subscribe({
        next: () => {
          this.isSaving = false;
          this.cerrarModal();
          this.mostrarExito('¡Cancha creada exitosamente!');
          this.cargarCanchas(); // Recargamos la tabla con la nueva cancha
        },
        error: (err) => {
          this.isSaving = false;
          this.mostrarError(err.error?.mensaje || 'Error al crear la cancha.');
        }
      });
    } else {
      // ===== MODO EDITAR =====
      // Llamamos a PUT /api/canchas/{id}
      this.canchasService.updateCancha(this.editingId, datos).subscribe({
        next: () => {
          this.isSaving = false;
          this.cerrarModal();
          this.mostrarExito('¡Cancha actualizada correctamente!');
          this.cargarCanchas(); // Recargamos para ver los cambios reflejados
        },
        error: (err) => {
          this.isSaving = false;
          this.mostrarError(err.error?.mensaje || 'Error al actualizar.');
        }
      });
    }
  }

  // ============================================================
  // ELIMINAR CANCHA (Solo Admin)
  // ============================================================

  // Abre el modal de confirmación antes de eliminar
  confirmarEliminar(cancha: Cancha): void {
    this.deletingCancha = cancha; // Guardamos la cancha que se quiere eliminar
    this.showDeleteModal = true;
  }

  // Cancela la eliminación y cierra el modal
  cancelarEliminar(): void {
    this.deletingCancha = null;
    this.showDeleteModal = false;
  }

  // Ejecuta la eliminación real después de la confirmación
  eliminarCancha(): void {
    if (!this.deletingCancha) return;
    this.isDeleting = true;

    // Llamamos a DELETE /api/canchas/{id}
    this.canchasService.deleteCancha(this.deletingCancha.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.mostrarExito(`"${this.deletingCancha?.nombre}" eliminada correctamente.`);
        this.deletingCancha = null;
        // Si era la única cancha de esta página, volvemos a la anterior
        if (this.canchas.length === 1 && this.page > 1) { this.page--; }
        this.cargarCanchas();
      },
      error: (err) => {
        this.isDeleting = false;
        this.mostrarError('Error al eliminar la cancha.');
      }
    });
  }

  // ============================================================
  // RESERVAR CANCHA (Solo Cliente)
  // ============================================================
  abrirModalReservar(cancha: Cancha): void {
    this.selectedCancha = cancha;
    this.reservaForm.reset();

    // Prefill: hoy
    const hoy = new Date();
    const hoyStr = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');

    // Prefill: siguiente hora redonda
    let nextHour = hoy.getHours() + 1;
    if (nextHour > 22) {
      nextHour = 8; // Reset to 8 AM next day if late
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      const mananaStr = manana.getFullYear() + '-' + String(manana.getMonth() + 1).padStart(2, '0') + '-' + String(manana.getDate()).padStart(2, '0');
      this.reservaForm.patchValue({ fecha: mananaStr });
    } else {
      this.reservaForm.patchValue({ fecha: hoyStr });
    }

    const nextHourStr = String(nextHour).padStart(2, '0') + ':00';
    const endHourStr = String(nextHour + 1).padStart(2, '0') + ':00';

    this.reservaForm.patchValue({
      horaInicio: nextHourStr,
      horaFin: endHourStr
    });

    this.showReservaModal = true;
  }

  cerrarReservaModal(): void {
    this.showReservaModal = false;
    this.selectedCancha = null;
    this.reservaForm.reset();
  }

  confirmarReserva(): void {
    if (this.reservaForm.invalid || !this.selectedCancha) return;

    const val = this.reservaForm.value;

    // Crear objetos Date para comparar y enviar
    const fechaInicio = new Date(`${val.fecha}T${val.horaInicio}:00`);
    const fechaFin = new Date(`${val.fecha}T${val.horaFin}:00`);
    const ahora = new Date();

    // Validación 1: Hora inicio debe ser menor que hora fin
    if (fechaInicio >= fechaFin) {
      this.mostrarError('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }

    // Validación 2: Fecha inicio no debe ser en el pasado
    if (fechaInicio < ahora) {
      this.mostrarError('La reserva no puede ser en el pasado. Elige una fecha y hora futura.');
      return;
    }

    const nuevaReserva: ReservaCreate = {
      canchaId: this.selectedCancha.id,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString()
    };

    this.isLoading = true;
    this.reservasService.createReserva(nuevaReserva).subscribe({
      next: () => {
        this.isLoading = false;
        this.cerrarReservaModal();
        this.mostrarExito('¡Reserva creada! Revisa "Mis Reservas" para verla.');
      },
      error: (err) => {
        this.isLoading = false;
        this.mostrarError(err.error?.mensaje || 'Error al reservar. Puede que ese horario ya esté ocupado.');
      }
    });
  }

  // ============================================================
  // UTILIDADES DE MENSAJES
  // ============================================================

  // Muestra un mensaje de éxito que desaparece solo después de 3.5 segundos
  private mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mensajeError = ''; // Limpiamos cualquier error previo
    setTimeout(() => this.mensajeExito = '', 3500);
  }

  // Muestra un mensaje de error que desaparece solo después de 4 segundos
  private mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.mensajeExito = ''; // Limpiamos cualquier éxito previo
    setTimeout(() => this.mensajeError = '', 4000);
  }

  // Formatea el precio en pesos colombianos: 80000 → "$80.000/hr"
  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio) + '/hr';
  }
}
