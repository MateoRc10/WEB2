using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReservasWEB2.Data;
using ReservasWEB2.DTOs;
using ReservasWEB2.Models;

namespace ReservasWEB2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // El atributo [Authorize] significa que NINGÚN endpoint de este controlador puede ser accedido
    // si el usuario no envía un Token JWT válido en su petición.
    [Authorize]
    public class CanchasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CanchasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Endpoint GET: /api/canchas?nombre=futbol&page=1&pageSize=10
        // Cualquier usuario autenticado (Cliente o Admin) puede listar las canchas.
        [HttpGet]
        public async Task<IActionResult> GetCanchas([FromQuery] string? nombre, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            // Empezamos armando la consulta a la base de datos (como si fuera un SELECT en SQL).
            // Usamos AsQueryable() para poder ir pegándole "filtros" antes de ejecutarla realmente.
            var query = _context.Canchas.AsQueryable();

            // PUNTOS EXTRA: Filtro de búsqueda por nombre.
            // Si el usuario nos pasó un 'nombre' por la URL, filtramos las canchas que contengan ese texto.
            if (!string.IsNullOrEmpty(nombre))
            {
                // EF Core traducirá esto a un LIKE '%nombre%' en SQL.
                // ToLower() para que la búsqueda ignore mayúsculas y minúsculas.
                query = query.Where(c => c.Nombre.ToLower().Contains(nombre.ToLower()));
            }

            // PUNTOS EXTRA: Paginación Server-Side.
            // Primero contamos el total de registros que coinciden con la búsqueda.
            var totalItems = await query.CountAsync();

            // Luego, calculamos cuántos registros "saltarnos" (Skip) y cuántos "tomar" (Take).
            // Ejemplo: Si estoy en la página 2 y el tamaño es 10. Me salto los primeros 10 y tomo los siguientes 10.
            var canchas = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Devolvemos tanto los datos de las canchas como información útil para armar la tabla paginada en el Frontend.
            return Ok(new
            {
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                Items = canchas
            });
        }

        // Endpoint GET: /api/canchas/5
        // Trae la información de una sola cancha por su Id.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCancha(int id)
        {
            var cancha = await _context.Canchas.FindAsync(id);

            if (cancha == null)
            {
                return NotFound(new { mensaje = "Cancha no encontrada" });
            }

            return Ok(cancha);
        }

        // Endpoint POST: /api/canchas
        // ATENCIÓN: Solo los usuarios con Rol "Admin" pueden crear nuevas canchas.
        // Si un "Cliente" intenta acceder aquí, recibirá un error 403 Forbidden.
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCancha([FromBody] CanchaCreateUpdateDTO model)
        {
            var nuevaCancha = new Cancha
            {
                Nombre = model.Nombre,
                Descripcion = model.Descripcion,
                PrecioPorHora = model.PrecioPorHora
            };

            _context.Canchas.Add(nuevaCancha);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Cancha creada exitosamente", cancha = nuevaCancha });
        }

        // Endpoint PUT: /api/canchas/5
        // Actualiza una cancha existente. Solo "Admin" puede hacerlo.
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCancha(int id, [FromBody] CanchaCreateUpdateDTO model)
        {
            // Buscamos si la cancha existe en la BD
            var cancha = await _context.Canchas.FindAsync(id);

            if (cancha == null)
            {
                return NotFound(new { mensaje = "Cancha no encontrada" });
            }

            // Actualizamos sus valores
            cancha.Nombre = model.Nombre;
            cancha.Descripcion = model.Descripcion;
            cancha.PrecioPorHora = model.PrecioPorHora;

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Cancha actualizada exitosamente" });
        }

        // Endpoint DELETE: /api/canchas/5
        // Elimina una cancha. Solo "Admin" puede hacerlo.
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCancha(int id)
        {
            var cancha = await _context.Canchas.FindAsync(id);

            if (cancha == null)
            {
                return NotFound(new { mensaje = "Cancha no encontrada" });
            }

            _context.Canchas.Remove(cancha);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Cancha eliminada exitosamente" });
        }
    }
}
