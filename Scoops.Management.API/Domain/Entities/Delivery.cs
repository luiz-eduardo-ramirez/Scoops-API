using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scoops.Management.API.Domain.Entities
{
    [Table("tb_deliveries")]
    public class Delivery
    {
        [Key]
        public long Id { get; set; }

        public DateTime Moment { get; set; } = DateTime.UtcNow;

        // Vamos usar um Enum simples (Pending, Completed)
        public string Status { get; set; } = "PENDING";

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        // --- RELACIONAMENTOS ---

        // Chave Estrangeira para o Fornecedor (em vez de User/Cliente)
        public long SupplierId { get; set; }

        [ForeignKey("SupplierId")]
        public virtual Supplier Supplier { get; set; } = null!;

        // Lista de Itens (Cascade ALL funciona nativo no EF Core se configurado)
        public virtual ICollection<DeliveryItem> Items { get; set; } = new List<DeliveryItem>();

        // Método auxiliar para recalcular total (igual ao Java)
        public void CalculateTotal()
        {
            Total = Items.Sum(i => i.SubTotal);
        }
    }
}