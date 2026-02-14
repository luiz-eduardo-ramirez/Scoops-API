using System.ComponentModel.DataAnnotations.Schema;

namespace Scoops.Management.API.Domain.Entities
{
    [Table("tb_delivery_items")]
    public class DeliveryItem
    {
        public long Id { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public decimal SubTotal => Quantity * Price;

        public long ProductId { get; set; }

        public Product Product { get; set; } = null!;

        public long DeliveryId { get; set; }
        public Delivery Delivery { get; set; } = null!;
    }
}