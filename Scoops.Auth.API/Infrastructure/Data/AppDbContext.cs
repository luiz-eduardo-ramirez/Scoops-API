using Microsoft.EntityFrameworkCore;
using Scoops.Domain.Entities; // Ajuste se o namespace for diferente

namespace Scoops.Auth.API.Infrastructure.Data
{
    // O DbContext é o equivalente ao EntityManager do JPA
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Aqui você define quais entidades viram tabelas (DbSet = Table)
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Aqui você pode fazer configurações finas, 
            // como índices únicos que você tinha no Java
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Login)
                .IsUnique();
        }
    }
}