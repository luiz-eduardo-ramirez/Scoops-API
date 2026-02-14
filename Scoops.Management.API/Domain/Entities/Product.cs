using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scoops.Management.API.Domain.Entities
{
    [Table("tb_products")]
    public class Product
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }


        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public string? Category { get; set; }

        public int StockQuantity { get; set; } = 0;

    }
}