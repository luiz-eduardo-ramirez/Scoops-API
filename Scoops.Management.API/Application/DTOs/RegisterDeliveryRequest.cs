namespace Scoops.Management.API.Application.DTOs
{
    public record RegisterDeliveryRequest(long SupplierId, List<DeliveryItemRequest> Items);
    public record DeliveryItemRequest(long ProductId, int Quantity, decimal Price);
}