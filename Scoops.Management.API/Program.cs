using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Scoops.Management.API.Infrastructure.Data;
using Scoops.Management.API.Services;
using System.Text.Json.Serialization;
using System.IdentityModel.Tokens.Jwt;
using Scoops.Management.API.Application.Interfaces;
using Scoops.Management.API.Application.Services;


JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();


AppContext.SetSwitch("Microsoft.AspNetCore.Authentication.JwtBearer.UseSecurityTokenValidator", true);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// --- 2. CORS ---
var MyAllowSpecificOrigins = "AllowReactApp";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// --- 3. BANCO DE DADOS ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ManagementDbContext>(options => options.UseSqlServer(connectionString));


var secretKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrEmpty(secretKey))
{
    throw new Exception("A chave JWT (Jwt:Key) não foi encontrada nas configurações do Management API!");
}

var key = Encoding.ASCII.GetBytes(secretKey);


builder.Services.AddScoped<IFileStorageService, FileStorageService>();

builder.Services.AddScoped<IDeliveryService, DeliveryService>();



builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.MapInboundClaims = false;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,

        // 3. DEFINIR os tipos de claim exatamente como o Auth gera
        NameClaimType = "unique_name",
        RoleClaimType = "role"
    };

    x.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            // 4. LOG DE DIAGNÓSTICO REAL
            // Vamos listar TODAS as claims que o .NET encontrou no seu token
            Console.WriteLine("\n=== INSPEÇÃO DE TOKEN ===");
            foreach (var claim in context.Principal.Claims)
            {
                Console.WriteLine($"🔍 Tipo: {claim.Type} | Valor: {claim.Value}");
            }

            var identity = context.Principal.Identity;
            Console.WriteLine($"👤 Nome Identificado: {identity?.Name}");
            Console.WriteLine($"🛡️ Está Autenticado? {identity?.IsAuthenticated}");
            Console.WriteLine("==========================\n");

            return Task.CompletedTask;
        }
    }; x.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            // 4. LOG DE DIAGNÓSTICO REAL
            // Vamos listar TODAS as claims que o .NET encontrou no seu token
            Console.WriteLine("\n=== INSPEÇÃO DE TOKEN ===");
            foreach (var claim in context.Principal.Claims)
            {
                Console.WriteLine($"🔍 Tipo: {claim.Type} | Valor: {claim.Value}");
            }

            var identity = context.Principal.Identity;
            Console.WriteLine($"👤 Nome Identificado: {identity?.Name}");
            Console.WriteLine($"🛡️ Está Autenticado? {identity?.IsAuthenticated}");
            Console.WriteLine("==========================\n");

            return Task.CompletedTask;
        }
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Inicialização do Banco
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ManagementDbContext>();
        context.Database.EnsureCreated();
        Console.WriteLine("--> Banco de dados Management OK!");
    }
    catch (Exception ex)
    {
        Console.WriteLine("--> Erro no banco: " + ex.Message);
    }
}

app.Run();