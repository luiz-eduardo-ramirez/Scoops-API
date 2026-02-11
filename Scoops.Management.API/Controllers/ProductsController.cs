using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scoops.Management.API.Application.DTOs;
using Scoops.Management.API.Domain.Entities;
using Scoops.Management.API.Infrastructure.Data;

namespace Scoops.Management.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly ManagementDbContext _context;

        public ProductsController(ManagementDbContext context) => _context = context;

        [HttpPost]
        public async Task<IActionResult> Create(CreateProductRequest request)
        {
            if (request.Price < 0) return BadRequest("O preço não pode ser negativo.");

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Category = request.Category,
                IsActive = true
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 0, [FromQuery] int size = 10)
        {
            var products = await _context.Products
                .Where(p => p.IsActive)
                .Skip(page * size)
                .Take(size)
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var product = await _context.Products.FindAsync(id);
            return product == null ? NotFound() : Ok(product);
        }
    }
}