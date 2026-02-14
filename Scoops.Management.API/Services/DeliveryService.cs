using Microsoft.EntityFrameworkCore;
using Scoops.Management.API.Application.DTOs;
using Scoops.Management.API.Application.Interfaces;
using Scoops.Management.API.Domain.Entities;
using Scoops.Management.API.Infrastructure.Data;

namespace Scoops.Management.API.Application.Services
{
    public class DeliveryService : IDeliveryService
    {
        private readonly ManagementDbContext _context;

        public DeliveryService(ManagementDbContext context)
        {
            _context = context;
        }

        public async Task<Delivery> RegisterDeliveryAsync(RegisterDeliveryRequest request)
        {
            // 1. Valida Fornecedor
            var supplier = await _context.Suppliers.FindAsync(request.SupplierId);
            if (supplier == null) throw new KeyNotFoundException("Fornecedor não encontrado.");

            // 2. Cria a Entrega
            var delivery = new Delivery
            {
                SupplierId = request.SupplierId,
                Moment = DateTime.UtcNow,
                Status = "COMPLETED"
            };

            decimal total = 0;

            // 3. Processa Itens e ATUALIZA ESTOQUE
            foreach (var itemDto in request.Items)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null) throw new KeyNotFoundException($"Produto ID {itemDto.ProductId} não encontrado.");


                product.StockQuantity += itemDto.Quantity;

                var deliveryItem = new DeliveryItem
                {
                    ProductId = product.Id,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price,
                    Delivery = delivery
                };

                total += deliveryItem.Price * deliveryItem.Quantity;
                delivery.Items.Add(deliveryItem);
            }

            delivery.Total = total;

            // 4. Salva (A transação garante que Delivery e Produto sejam salvos juntos)
            _context.Deliveries.Add(delivery);
            await _context.SaveChangesAsync();

            return delivery;
        }

        public async Task<IEnumerable<Delivery>> GetAllDeliveriesAsync()
        {
            return await _context.Deliveries
                .Include(d => d.Supplier)
                .Include(d => d.Items)
                .ThenInclude(i => i.Product)
                .OrderByDescending(d => d.Moment)
                .ToListAsync();
        }
    }
}