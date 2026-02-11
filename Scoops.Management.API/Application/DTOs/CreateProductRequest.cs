namespace Scoops.Management.API.Application.DTOs
{
    public record CreateProductRequest(string Name, decimal Price, string Description, string Category);
}