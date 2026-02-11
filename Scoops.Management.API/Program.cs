using Microsoft.AspNetCore.Authentication.JwtBearer; // <--- NECESSÁRIO
using Microsoft.IdentityModel.Tokens;                // <--- NECESSÁRIO
using Microsoft.EntityFrameworkCore;
using System.Text;
using Scoops.Management.API.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura o CORS
var MyAllowSpecificOrigins = "AllowReactApp";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddControllers();

// 2. Configura o Banco
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ManagementDbContext>(options =>
    options.UseSqlServer(connectionString));

// =========================================================================
// 3. CONFIGURAÇÃO DO JWT (Faltava isso aqui!)
// =========================================================================
var key = Encoding.ASCII.GetBytes("EstaEUmaChaveSuperSecretaComMaisDe32CaracteresParaOProjetoScoops2026!"); // AVISO: Use a MESMA chave que está no Auth API

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});
// =========================================================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 4. ATIVA O CORS (Antes de Auth!)
app.UseCors(MyAllowSpecificOrigins);

app.UseStaticFiles();

app.UseAuthentication(); // <--- OBRIGATÓRIO TER ISSO
app.UseAuthorization();

app.MapControllers();

// Migrations
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ManagementDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine("--> Erro ao aplicar migrations: " + ex.Message);
    }
}

app.Run();