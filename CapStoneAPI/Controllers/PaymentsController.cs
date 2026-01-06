using CapStoneAPI.Dtos.Payment;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CapStoneAPI.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentsController(IPaymentService service)
        {
            _service = service;
        }

        // Customer pays premium
        [Authorize(Roles = "Customer")]
        [HttpPost("premium")]
        public async Task<IActionResult> PayPremium(MakePremiumPaymentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _service.MakePremiumPaymentAsync(dto, userId);
            return Ok("Premium payment successful");
        }

        // View payment history
        [Authorize(Roles = "InsuranceAgent,Customer,ClaimsOfficer,Hospital")]
        [HttpGet]
        public async Task<IActionResult> GetPayments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var role = User.FindFirstValue(ClaimTypes.Role)!;

            return Ok(await _service.GetPaymentsAsync(userId, role));
        }
    }

}
