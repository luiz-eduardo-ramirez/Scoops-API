using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Scoops.Management.API.Infrastructure.Data;
using Scoops.Management.API.Services;
using System.Text.Json.Serialization;

// Habilita validadores legacy se necessário (mantido do seu código original)
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

// ==============================================================================
// 🔐 CORREÇÃO DE SEGURANÇA: Ler chave do Docker
// ==============================================================================
var secretKey = builder.Configuration["Jwt:Key"]; // Lê a variável de ambiente Jwt__Key

if (string.IsNullOrEmpty(secretKey))
{
    // Falha rápida se a chave não estiver configurada no Docker
    throw new Exception("A chave JWT (Jwt:Key) não foi encontrada nas configurações do Management API!");
}

var key = Encoding.ASCII.GetBytes(secretKey);
// ==============================================================================

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
        // Agora usa a chave dinâmica vinda do Docker
        IssuerSigningKey = new SymmetricSecurityKey(key),

        TryAllIssuerSigningKeys = true,

        // Mantendo suas configurações de validação
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,

        // Mapeamento de Claims (Importante conferir se bate com o AuthController)
        RoleClaimType = "role",
        NameClaimType = "unique_name"
    };

    // Logs detalhados para ajudar no debug (Mantidos)
    x.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"\n🔴 AUTH FALHOU: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine($"\n🟢 SUCESSO! Usuário validado: {context.Principal.Identity.Name}");
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

app.UseAuthentication(); // 1. Quem é você?
app.UseAuthorization();  // 2. O que você pode fazer?

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