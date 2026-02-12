using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scoops.Management.API.Application.DTOs;
using Scoops.Management.API.Infrastructure.Data;

namespace Scoops.Management.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly ManagementDbContext _context;

        public DashboardController(ManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardStats>> GetStats()
        {
            // 1. Faturamento (Apenas pedidos PAGOS)
            var revenue = await _context.Orders
                .Where(o => o.Status == "PAID")
                .SumAsync(o => o.Total);

            // 2. Contagens Gerais
            var totalOrders = await _context.Orders.CountAsync();
            var pendingOrders = await _context.Orders.CountAsync(o => o.Status == "PENDING");

            // 3. Alerta de Estoque (Menos de 5 unidades e ativos)
            var lowStock = await _context.Products
                .CountAsync(p => p.IsActive && p.StockQuantity < 5);

            // 4. Top 5 Produtos Mais Vendidos (Query complexa simplificada)
            var topProducts = await _context.OrderItems
                .Include(i => i.Product)
                .GroupBy(i => i.Product.Name)
                .Select(g => new TopProductDto(g.Key, g.Sum(i => i.Quantity)))
                .OrderByDescending(x => x.QuantitySold)
                .Take(5)
                .ToListAsync();

            return Ok(new DashboardStats(revenue, totalOrders, lowStock, pendingOrders, topProducts));
        }
    }
}