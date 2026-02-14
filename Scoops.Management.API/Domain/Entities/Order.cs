using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scoops.Management.API.Domain.Entities
{
    [Table("tb_orders")]
    public class Order
    {
        [Key]
        public long Id { get; set; }

        public DateTime Moment { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "PENDING"; // PENDING, PAID, SHIPPED, DELIVERED, CANCELED

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }


        public string ClientLogin { get; set; } = string.Empty;

        public string? ContactPhone { get; set; }
        public string? DeliveryAddress { get; set; }

        public string? InstagramReelUrl { get; set; }
        public string? TrackingUrl { get; set; }

        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}