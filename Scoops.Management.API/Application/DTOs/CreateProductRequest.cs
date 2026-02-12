using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Scoops.Management.API.Application.DTOs
{
    public class CreateProductRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string? Category { get; set; }

        [Required]
        public int StockQuantity { get; set; } = 0;


        // Esta propriedade recebe o arquivo enviado pelo front (formData.append("file", ...))
        public IFormFile? File { get; set; }
    }
}