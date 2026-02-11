using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // Equivalente ao Jackson

namespace Scoops.Management.API.Domain.Entities
{
    [Table("tb_delivery_items")]
    public class DeliveryItem
    {
        [Key]
        public long Id { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // --- RELACIONAMENTOS ---

        public long DeliveryId { get; set; }

        [JsonIgnore] // Evita ciclo infinito no JSON
        [ForeignKey("DeliveryId")]
        public virtual Delivery Delivery { get; set; } = null!;

        public long ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        // Propriedade calculada (Get) - Igual ao getSubTotal() do Java
        [NotMapped] // Não cria coluna no banco, é calculado na hora
        public decimal SubTotal => Price * Quantity;
    }
}