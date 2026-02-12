using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scoops.Management.API.Application.DTOs;
using Scoops.Management.API.Domain.Entities;
using Scoops.Management.API.Infrastructure.Data;
using Scoops.Management.API.Application.DTOs;

namespace Scoops.Management.API.Controllers
{
    [Authorize]
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ManagementDbContext _context;

        public OrdersController(ManagementDbContext context)
        {
            _context = context;
        }

        // 1. CRIAR PEDIDO (Cliente)
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            // Pega o login do usuário autenticado no token
            var userLogin = User.Identity?.Name ?? "Anonymous";

            var order = new Order
            {
                ClientLogin = userLogin,
                DeliveryAddress = request.Address,
                ContactPhone = request.Phone,
                Moment = DateTime.UtcNow,
                Status = "PENDING"
            };

            decimal total = 0;

            foreach (var itemDto in request.Items)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null) return BadRequest($"Produto {itemDto.ProductId} não encontrado.");

                var orderItem = new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    Price = product.Price, // Pega o preço ATUAL do produto
                    Order = order
                };

                total += orderItem.Price * orderItem.Quantity;
                order.Items.Add(orderItem);
            }

            order.Total = total;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Retorna 201 com os dados do pedido criado
            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        // 2. MEUS PEDIDOS (Cliente)
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetMyOrders()
        {
            var userLogin = User.Identity?.Name;

            return await _context.Orders
                .Where(o => o.ClientLogin == userLogin)
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.Moment)
                .ToListAsync();
        }

        // 3. TODOS OS PEDIDOS (Admin)
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        [HttpGet("all-orders")] // Mantive a rota igual ao Java
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            return await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.Moment)
                .ToListAsync();
        }

        // 4. DETALHES (Auxiliar)
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(long id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            // Segurança: Se não for admin, só pode ver o próprio pedido
            var userLogin = User.Identity?.Name;
            var isAdmin = User.IsInRole("ADMIN");

            if (!isAdmin && order.ClientLogin != userLogin)
                return Forbid();

            return order;
        }

        // 5. ATUALIZAR STATUS (Admin)
        [Authorize(Roles = "ADMIN")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(long id, [FromBody] Dictionary<string, string> body)
        {
            if (!body.ContainsKey("status")) return BadRequest("Status é obrigatório");

            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = body["status"].ToUpper(); // Ex: PAID, SHIPPED
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 6. ATUALIZAR LINKS (Admin - Rastreio/Reels)
        [Authorize(Roles = "ADMIN")]
        [HttpPatch("{id}/links")]
        public async Task<IActionResult> UpdateLinks(long id, [FromBody] UpdateOrderLinksRequest dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            if (dto.InstagramReelUrl != null) order.InstagramReelUrl = dto.InstagramReelUrl;
            if (dto.TrackingUrl != null) order.TrackingUrl = dto.TrackingUrl;

            await _context.SaveChangesAsync();

            return Ok(order);
        }
        [HttpPost("{id}/pix")]
        public async Task<ActionResult<PixResponseDTO>> GeneratePix(long id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound("Pedido não encontrado.");
            }

            // Mock de código PIX (Exemplo estático para teste)
            // Na vida real, aqui você chamaria o Banco Central ou um Gateway (Mercado Pago, StarkBank, etc)
            var pixCodeMock = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405" + order.Total.ToString("F2").Replace(",", ".") + "5802BR5913Scoops Amanda6008Sao Paulo62070503***6304ABCD";

            return Ok(new PixResponseDTO(pixCodeMock, order.Total));
        }
    }
}