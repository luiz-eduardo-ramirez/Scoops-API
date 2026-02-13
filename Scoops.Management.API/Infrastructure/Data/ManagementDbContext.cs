using Microsoft.EntityFrameworkCore;
using Scoops.Management.API.Domain.Entities;

namespace Scoops.Management.API.Infrastructure.Data
{
    public class ManagementDbContext : DbContext
    {
        public ManagementDbContext(DbContextOptions<ManagementDbContext> options) : base(options)
        {
        }

        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<DeliveryItem> DeliveryItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração extra para garantir precisão no preço (Money)
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Delivery>()
                .Property(d => d.Total)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<DeliveryItem>()
                .Property(i => i.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}