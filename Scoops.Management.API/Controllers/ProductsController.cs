using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scoops.Management.API.Application.DTOs;
using Scoops.Management.API.Domain.Entities;
using Scoops.Management.API.Infrastructure.Data;
using Scoops.Management.API.Services;


namespace Scoops.Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ManagementDbContext _context;
        private readonly IWebHostEnvironment _environment;

        private readonly IFileStorageService _fileService;

        public ProductsController(ManagementDbContext context, IWebHostEnvironment environment, IFileStorageService fileService)
        {
            _context = context;
            _environment = environment;
            _fileService = fileService;
        }

        // 1. LISTAR TUDO (Igual ao Java: getAll)
        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            // Retorna apenas os ativos para não poluir, ou todos se preferir igual ao Java cru
            return await _context.Products
                .Where(p => p.IsActive)
                .ToListAsync();
        }

        // 2. PAGINAÇÃO (Igual ao Java: getAllPaged)
        // GET: api/products/paged?page=0&size=5
        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllPaged(
            [FromQuery] int page = 0,
            [FromQuery] int size = 5)
        {
            // Java: Sort.by("id").descending()
            return await _context.Products
                .Where(p => p.IsActive) // Filtra inativos
                .OrderByDescending(p => p.Id) // Ordena por ID decrescente
                .Skip(page * size)
                .Take(size)
                .ToListAsync();
        }

        // 3. DETALHES (Igual ao Java: getById)
        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(long id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(); // Retorna 404
            }

            return Ok(product); // Retorna 200 com o objeto
        }

        // 4. CRIAR (Igual ao Java: create com Multipart)
        // POST: api/products
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromForm] CreateProductRequest request)
        {
            // O Controller não sabe COMO salva, ele só pede para salvar.
            string? imageUrl = null;

            if (request.File != null)
            {
                imageUrl = await _fileService.SaveFileAsync(request.File);
            }

            // Criação da entidade
            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Category = request.Category,
                ImageUrl = imageUrl, // Salva o caminho relativo
                IsActive = true
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        // 5. DELETAR / INATIVAR (Igual ao Java: inactivateProduct)
        // DELETE: api/products/5
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Soft Delete (Inativação) em vez de remover do banco
            product.IsActive = false;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}