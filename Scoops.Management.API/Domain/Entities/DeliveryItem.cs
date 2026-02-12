using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Scoops.Management.API.Domain.Entities
{
    [Table("tb_delivery_items")]
    public class DeliveryItem
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // Chave estrangeira da Entrega
        public long DeliveryId { get; set; }

        [JsonIgnore] // Evita ciclo infinito no JSON
        [ForeignKey("DeliveryId")]
        public virtual Delivery Delivery { get; set; } = null!;

        // Chave estrangeira do Produto
        public Guid ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        // Propriedade calculada (não salva no banco, mas útil)
        [NotMapped]
        public decimal SubTotal => Price * Quantity;
    }
}