using Scoops.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Scoops.Auth.API.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context, IConfiguration configuration)
        {
            // Aplica migrações pendentes automaticamente (opcional, mas útil em Docker)
            context.Database.Migrate();

            // Verifica se já tem usuários
            if (context.Users.Any())
            {
                return; // O banco já foi populado
            }

            // Pega as credenciais do .env (ou appsettings)
            var adminEmail = configuration["ADMIN_EMAIL"] ?? "admin@scoops.com";
            var adminPass = configuration["ADMIN_PASSWORD"] ?? "admin123";

            // CRÍTICO: Criptografar a senha antes de salvar!
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(adminPass);

            var admin = new User
            {
                Login = adminEmail.ToLower(), // Normaliza para minúsculo
                Password = passwordHash,      // Salva o HASH, não o texto puro
                Name = "Amanda Admin",
                Role = "ADMIN",
                Enabled = true
            };

            context.Users.Add(admin);
            context.SaveChanges();

            Console.WriteLine($"👑 [SEED] Usuário Admin criado: {adminEmail}");
        }
    }
}