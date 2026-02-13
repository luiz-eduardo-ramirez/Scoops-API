using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scoops.Auth.API.Application.DTOs;
using Scoops.Domain.Entities;
using Scoops.Auth.API.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Scoops.Auth.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // 1. CADASTRAR (POST /api/auth/register)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Login == user.Login))
                return BadRequest("Usuário já existe!");

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            if (string.IsNullOrEmpty(user.Role)) user.Role = "USER";
            user.Enabled = true;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuário cadastrado com sucesso!" });
        }

        // 2. LOGAR (POST /api/auth/login)
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            var loginInput = request.Login.Trim().ToLower();
            Console.WriteLine($"--> Tentativa de login: [{loginInput}]");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == loginInput);

            if (user == null)
            {
                return Unauthorized("Login ou senha inválidos.");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                Console.WriteLine("--> Erro: Senha não confere.");
                return Unauthorized("Login ou senha inválidos.");
            }

            // 1. Gera apenas a STRING do token
            var tokenString = GenerateJwtToken(user);

            // 2. Monta a resposta aqui no Controller
            return Ok(new AuthResponse(
                user.Id,                    // ID 
                tokenString,                // Token
                user.Name ?? user.Login,    // Username 
                user.Login,                 // Email
                user.Role
            ));
        }

        // Método auxiliar: Gera o Token assinado com a chave do Docker
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new Exception("A configuração 'Jwt:Key' não foi encontrada.");
            }
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    // MANTENHA ESTES:
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Login),
                    
                    // 🔴 MUDE ESTA LINHA:
                    // De: new Claim(ClaimTypes.Role, user.Role)
                    // Para:
                    new Claim("role", user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}