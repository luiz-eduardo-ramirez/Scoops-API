using System.Text.Json.Serialization;

namespace Scoops.Auth.API.Application.DTOs
{
    public record LoginRequest(
        [property: JsonPropertyName("login")] string Login,
        [property: JsonPropertyName("password")] string Password
    );
}