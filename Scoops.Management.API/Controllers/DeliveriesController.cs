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
    [Route("api/deliveries")]
    public class DeliveriesController : ControllerBase
    {
        private readonly ManagementDbContext _context;

        public DeliveriesController(ManagementDbContext context) => _context = context;

        [HttpPost]
        public async Task<IActionResult> RegisterDelivery(RegisterDeliveryRequest request)
        {
            // 1. Valida Fornecedor
            var supplier = await _context.Suppliers.FindAsync(request.SupplierId);
            if (supplier == null) return NotFound("Fornecedor não encontrado.");

            // 2. Cria a Entrega (Cabeçalho)
            var delivery = new Delivery
            {
                SupplierId = request.SupplierId,
                Moment = DateTime.UtcNow,
                Status = "COMPLETED"
            };

            // 3. Processa os Itens
            foreach (var itemDto in request.Items)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null) return BadRequest($"Produto ID {itemDto.ProductId} não encontrado.");


                var deliveryItem = new DeliveryItem
                {
                    ProductId = product.Id,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price, // Preço de custo na entrega
                    Delivery = delivery // Vincula ao pai
                };

                delivery.Items.Add(deliveryItem);
            }

            // 4. Calcula Total
            delivery.CalculateTotal();

            // 5. Salva Tudo 
            _context.Deliveries.Add(delivery);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Entrega registrada com sucesso!", DeliveryId = delivery.Id, Total = delivery.Total });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Include traz os dados relacionados 
            var deliveries = await _context.Deliveries
                .Include(d => d.Supplier)
                .Include(d => d.Items)
                .ThenInclude(i => i.Product)
                .ToListAsync();

            return Ok(deliveries);
        }
    }
}