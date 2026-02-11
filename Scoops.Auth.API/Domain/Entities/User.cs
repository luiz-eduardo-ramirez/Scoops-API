using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scoops.Domain.Entities
{
    [Table("tb_users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [Column("login")]
        public string Login { get; set; } = string.Empty;

        [Column("full_name")]
        public string? Name { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        // No .NET, roles costumam ser strings simples ou enums
        public string Role { get; set; } = "USER";

        public bool Enabled { get; set; } = false;

        [Column("verification_token")]
        public string? VerificationToken { get; set; }
    }
}