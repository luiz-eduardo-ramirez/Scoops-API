using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scoops.Management.API.Application.DTOs;
using Scoops.Management.API.Domain.Entities;
using Scoops.Management.API.Infrastructure.Data;

namespace Scoops.Management.API.Controllers
{
    [Authorize] // Protege tudo com JWT
    [ApiController]
    [Route("api/suppliers")]
    public class SuppliersController : ControllerBase
    {
        private readonly ManagementDbContext _context;

        public SuppliersController(ManagementDbContext context) => _context = context;

        [HttpPost]
        public async Task<IActionResult> Create(CreateSupplierRequest request)
        {
            var supplier = new Supplier
            {
                Name = request.Name,
                Cnpj = request.Cnpj,
                ContactPhone = request.Phone,
                ContactEmail = request.Email
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = supplier.Id }, supplier);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            return supplier == null ? NotFound() : Ok(supplier);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Suppliers.ToListAsync());
        }
    }
}