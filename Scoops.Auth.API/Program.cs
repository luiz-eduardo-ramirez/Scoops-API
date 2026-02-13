using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Scoops.Auth.API.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura CORS
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

// ==============================================================================
// 🔐 CORREÇÃO DE SEGURANÇA: Ler chave do Docker/appsettings
// ==============================================================================
var secretKey = builder.Configuration["Jwt:Key"]; // Lê a variável de ambiente Jwt__Key

if (string.IsNullOrEmpty(secretKey))
{
    // Para a aplicação imediatamente se não houver chave configurada
    throw new Exception("A chave JWT (Jwt:Key) não foi encontrada nas configurações!");
}

var key = Encoding.ASCII.GetBytes(secretKey);
// ==============================================================================

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

        // Mantendo suas configurações originais para simplificar o debug inicial
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Configura Banco de Autenticação
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// 4. Executa o Seed (Criação do Admin)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var config = services.GetRequiredService<IConfiguration>();
        DbInitializer.Seed(context, config);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocorreu um erro ao popular o banco de dados.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 5. Ordem dos Middlewares
app.UseCors(MyAllowSpecificOrigins);

app.UseStaticFiles();
// app.UseHttpsRedirection(); // Comentado para ambiente Docker dev

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();