using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scoops.Domain.Entities
{
    [Table("refresh_token")]
    public class RefreshToken
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public DateTime ExpiryDate { get; set; }

        // Chave estrangeira para o User
        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}