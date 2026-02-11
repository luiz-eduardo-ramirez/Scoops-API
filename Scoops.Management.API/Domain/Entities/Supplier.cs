using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scoops.Management.API.Domain.Entities
{
    [Table("tb_suppliers")]
    public class Supplier
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Cnpj { get; set; } = string.Empty;

        public string? ContactPhone { get; set; }

        public string? ContactEmail { get; set; }

        // Relacionamento: Um fornecedor faz várias entregas
        public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
    }
}