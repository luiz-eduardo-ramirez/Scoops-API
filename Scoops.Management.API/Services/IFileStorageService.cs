using Microsoft.AspNetCore.Http;

namespace Scoops.Management.API.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file);
    }
}