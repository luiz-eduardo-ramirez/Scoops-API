using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scoops.Management.API.Infrastructure.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar o Banco de Dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ManagementDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Configurar a Segurança JWT (Para validar o token que vem do Auth)
var key = Encoding.ASCII.GetBytes("UmaChaveSuperSecretaEComPeloMenos32Caracteres!"); // Mesma chave do Auth!
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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurações de Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Importante: A ordem importa! Auth vem antes de MapControllers
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();