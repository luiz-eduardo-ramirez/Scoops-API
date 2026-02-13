namespace Scoops.Management.API.Application.DTOs
{
    public class RegisterDeliveryRequest
    {
        public long SupplierId { get; set; }
        public List<DeliveryItemRequest> Items { get; set; } = new();
    }

    public class DeliveryItemRequest
    {
        public long ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}