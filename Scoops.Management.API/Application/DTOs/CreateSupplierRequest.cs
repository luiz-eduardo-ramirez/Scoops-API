namespace Scoops.Management.API.Application.DTOs
{
    public record CreateSupplierRequest(string Name, string Cnpj, string Phone, string Email);
}