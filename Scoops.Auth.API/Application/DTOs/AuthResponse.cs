namespace Scoops.Auth.API.Application.DTOs
{
    public record AuthResponse(string Token, string Name, string Role);
}