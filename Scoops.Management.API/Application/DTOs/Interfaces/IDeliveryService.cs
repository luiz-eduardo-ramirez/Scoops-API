using Scoops.Management.API.Application.DTOs;
using Scoops.Management.API.Domain.Entities;

namespace Scoops.Management.API.Application.Interfaces
{
    public interface IDeliveryService
    {
        Task<Delivery> RegisterDeliveryAsync(RegisterDeliveryRequest request);
        Task<IEnumerable<Delivery>> GetAllDeliveriesAsync();
    }
}