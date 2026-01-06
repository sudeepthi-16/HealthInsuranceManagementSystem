using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CapStoneAPI.Services.Interfaces;
using CapStoneAPI.Dtos.Dashboard;

namespace CapStoneAPI.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service)
        {
            _service = service;
        }
        [Authorize(Roles = "InsuranceAgent,ClaimsOfficer")]
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
            => Ok(await _service.GetDashboardSummaryAsync());
        [Authorize(Roles = "InsuranceAgent,ClaimsOfficer")]
        [HttpGet("claims-by-officer")]
        public async Task<IActionResult> GetClaimsByOfficer()
            => Ok(await _service.GetClaimsByOfficerAsync());
        [Authorize(Roles = "InsuranceAgent,ClaimsOfficer")]
        [HttpGet("policies-by-status")]
        public async Task<IActionResult> GetPoliciesByStatus()
            => Ok(await _service.GetPoliciesByStatusAsync());
        [Authorize(Roles = "InsuranceAgent,ClaimsOfficer")]
        [HttpGet("claims-by-status")]
        public async Task<IActionResult> GetClaimsByStatus()
            => Ok(await _service.GetClaimsByStatusAsync());
        [Authorize(Roles = "InsuranceAgent,ClaimsOfficer")]
        [HttpGet("claims-by-hospital")]
        public async Task<IActionResult> GetClaimsByHospital()
            => Ok(await _service.GetClaimsByHospitalAsync());

        [Authorize(Roles = "InsuranceAgent,ClaimsOfficer")]
        [HttpGet("high-value-claims")]
        public async Task<IActionResult> GetHighValueClaims()
            => Ok(await _service.GetHighValueClaimsAsync());

        [Authorize(Roles = "Hospital")]
        [HttpGet("hospital/summary")]
        public async Task<IActionResult> HospitalSummary()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                             ?? User.FindFirst("sub")?.Value;

                if (string.IsNullOrEmpty(userId)) return Unauthorized("User ID not found");

                return Ok(await _service.GetHospitalSummaryAsync(userId));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal error fetching summary", error = ex.Message });
            }
        }
    }

}
