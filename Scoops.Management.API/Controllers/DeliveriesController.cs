using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scoops.Management.API.Application.DTOs;
using Scoops.Management.API.Application.Interfaces;
using Scoops.Management.API.Domain.Entities;

namespace Scoops.Management.API.Controllers
{
    [Authorize] // Pode restringir para Roles = "ADMIN" se quiser
    [ApiController]
    [Route("api/deliveries")]
    public class DeliveriesController : ControllerBase
    {
        private readonly IDeliveryService _service;

        // Injeção da Interface, não do Banco
        public DeliveriesController(IDeliveryService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterDelivery(RegisterDeliveryRequest request)
        {
            try
            {
                var delivery = await _service.RegisterDeliveryAsync(request);

                return Ok(new
                {
                    Message = "Entrega registrada com sucesso!",
                    DeliveryId = delivery.Id,
                    Total = delivery.Total
                });
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var deliveries = await _service.GetAllDeliveriesAsync();
            return Ok(deliveries);
        }
    }
}