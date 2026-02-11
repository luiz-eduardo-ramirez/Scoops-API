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

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // 1. CADASTRAR (POST /api/auth/register)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            // Valida se já existe
            if (await _context.Users.AnyAsync(u => u.Login == user.Login))
                return BadRequest("Usuário já existe!");

            // Criptografa a senha (BCrypt)
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            // Define padrão
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
            // Busca usuário
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == request.Login);

            // Valida senha criptografada
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                return Unauthorized("Login ou senha inválidos.");

            // Gera Token
            var token = GenerateJwtToken(user);

            return new AuthResponse(token, user.Name ?? user.Login, user.Role);
        }

        // Método auxiliar para gerar o JWT
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            // A mesma chave que configuramos no Program.cs
            var key = Encoding.ASCII.GetBytes("UmaChaveSuperSecretaEComPeloMenos32Caracteres!");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}