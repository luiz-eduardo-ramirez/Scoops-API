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

            // ====================================================================================
            // 4. CORREÇÃO: Top 5 Produtos (Execução em Memória para evitar erro de tradução LINQ)
            // ====================================================================================

            // Passo A: Buscar os dados brutos do banco (Trazemos apenas o necessário)
            var rawData = await _context.OrderItems
                .Include(i => i.Product)
                .Select(i => new { ProductName = i.Product.Name, Quantity = i.Quantity })
                .ToListAsync(); // <--- O SQL é executado aqui!

            // Passo B: Agrupar e ordenar na memória do servidor
            var topProducts = rawData
                .GroupBy(x => x.ProductName)
                .Select(g => new TopProductDto(g.Key, g.Sum(x => x.Quantity)))
                .OrderByDescending(x => x.QuantitySold)
                .Take(5)
                .ToList();
            // ====================================================================================

            return Ok(new DashboardStats(revenue, totalOrders, lowStock, pendingOrders, topProducts));
        }
    }
}