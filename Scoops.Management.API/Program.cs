using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Scoops.Management.API.Infrastructure.Data;
using Scoops.Management.API.Services;
using System.Text.Json.Serialization; // Necessário para o IgnoreCycles

var builder = WebApplication.CreateBuilder(args);

// =========================================================================
// 1. CONFIGURAÇÃO DOS CONTROLLERS + JSON (CORREÇÃO AQUI)
// =========================================================================
// O .AddJsonOptions deve ficar GRUDADO no AddControllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Isso resolve o erro "Possible object cycle" (Erro 500)
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 2. Configura o CORS
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

// 3. Configura o Banco
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ManagementDbContext>(options =>
    options.UseSqlServer(connectionString));

// =========================================================================
// 4. CONFIGURAÇÃO DO JWT
// =========================================================================
var secretKey = "EstaEUmaChaveSuperSecretaComMaisDe32CaracteresParaOProjetoScoops2026!";
var key = Encoding.ASCII.GetBytes(secretKey);

// Registra o serviço de Upload de Arquivos
builder.Services.AddScoped<IFileStorageService, FileStorageService>();

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

// 5. ATIVA O CORS (Antes de Auth!)
app.UseCors(MyAllowSpecificOrigins);

// Permite servir as imagens da pasta wwwroot
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ManagementDbContext>();

        context.Database.EnsureCreated();
        Console.WriteLine("--> Banco de dados verificado/criado com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine("--> Erro ao criar banco de dados: " + ex.Message);
    }
}

app.Run();