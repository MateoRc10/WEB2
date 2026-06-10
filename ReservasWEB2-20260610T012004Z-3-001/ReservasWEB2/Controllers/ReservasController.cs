using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReservasWEB2.Data;
using ReservasWEB2.DTOs;
using ReservasWEB2.Models;
using System.Security.Claims;

namespace ReservasWEB2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Todo este controlador está protegido por el Token JWT.
    public class ReservasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Endpoint GET: /api/reservas
        [HttpGet]
        public async Task<IActionResult> GetReservas()
        {
            // Averiguamos quién está haciendo la petición sacando su Id del Token.
            // En el AuthController guardamos el Id en el "Sub" del token.
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            int userId = int.Parse(userIdStr);

            // Preparamos la consulta. Usamos Include para traer el Nombre de la Cancha y del Usuario (Join automático).
            var query = _context.Reservas
                .Include(r => r.Cancha)
                .Include(r => r.Usuario)
                .AsQueryable();

            // Lógica de negocio de roles: 
            // Si el usuario NO es Admin, SOLO puede ver SUS PROPIAS reservas.
            if (userRole != "Admin")
            {
                query = query.Where(r => r.UsuarioId == userId);
            }

            // Ejecutamos la consulta y transformamos cada Reserva de la BD a nuestro ReservaResponseDTO
            // para enviar solo la información necesaria al frontend.
            var reservas = await query.Select(r => new ReservaResponseDTO
            {
                Id = r.Id,
                CanchaNombre = r.Cancha!.Nombre,
                UsuarioNombre = r.Usuario!.Nombre,
                FechaInicio = r.FechaInicio,
                FechaFin = r.FechaFin,
                Estado = r.Estado
            }).ToListAsync();

            return Ok(reservas);
        }

        // Endpoint POST: /api/reservas
        [HttpPost]
        public async Task<IActionResult> CreateReserva([FromBody] ReservaCreateDTO model)
        {
            // Extraemos el Id del usuario desde el Token
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            int userId = int.Parse(userIdStr);

            // Validamos que la fecha de inicio sea menor a la de fin
            if (model.FechaInicio >= model.FechaFin)
            {
                return BadRequest(new { mensaje = "La fecha de inicio debe ser anterior a la fecha de fin." });
            }

            // Validamos que la cancha exista
            var cancha = await _context.Canchas.FindAsync(model.CanchaId);
            if (cancha == null) return NotFound(new { mensaje = "Cancha no encontrada." });

            // Validación de Regla de Negocio Crítica: Evitar solapamiento de horarios
            // Buscamos si en la base de datos ya existe una reserva para esa misma cancha que se cruce en tiempo.
            var solapamiento = await _context.Reservas.AnyAsync(r =>
                r.CanchaId == model.CanchaId &&
                r.Estado != "Cancelada" && // Las canceladas no cuentan
                (model.FechaInicio < r.FechaFin && model.FechaFin > r.FechaInicio) // Lógica matemática de intersección de rangos
            );

            if (solapamiento)
            {
                return BadRequest(new { mensaje = "La cancha ya está reservada en ese horario." });
            }

            // Creamos la nueva reserva
            var nuevaReserva = new Reserva
            {
                UsuarioId = userId,
                CanchaId = model.CanchaId,
                FechaInicio = model.FechaInicio,
                FechaFin = model.FechaFin,
                Estado = "Confirmada"
            };

            _context.Reservas.Add(nuevaReserva);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Reserva creada exitosamente" });
        }

        // Endpoint DELETE: /api/reservas/5 (Cancelar reserva)
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelarReserva(int id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            int userId = int.Parse(userIdStr);

            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return NotFound(new { mensaje = "Reserva no encontrada." });

            // Un Cliente solo puede cancelar SU reserva. Un Admin puede cancelar la de cualquiera.
            if (userRole != "Admin" && reserva.UsuarioId != userId)
            {
                return Forbid(); // Retorna 403 (Acceso Denegado)
            }

            // En lugar de borrar la reserva físicamente de la BD (Delete), 
            // solo le cambiamos el Estado. Esto se conoce como "Soft Delete" y ayuda a mantener un historial.
            reserva.Estado = "Cancelada";
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Reserva cancelada exitosamente." });
        }
    }
}
