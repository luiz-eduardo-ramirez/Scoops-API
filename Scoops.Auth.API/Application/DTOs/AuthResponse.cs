using System.Text.Json.Serialization;

namespace Scoops.Auth.API.Application.DTOs
{
    public class AuthResponse
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("accessToken")]
        public string Token { get; set; }

        [JsonPropertyName("tokenType")]
        public string TokenType { get; set; } = "Bearer";

        [JsonPropertyName("username")]
        public string Username { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("roles")]
        public List<string> Roles { get; set; }

        public AuthResponse(long id, string token, string username, string email, string role)
        {
            Id = id;
            Token = token;
            Username = username;
            Email = email;
            Roles = new List<string> { role };
        }
    }
}