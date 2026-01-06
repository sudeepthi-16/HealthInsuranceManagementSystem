using CapStoneAPI.Dtos.Claims;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CapStoneAPI.Controllers
{
    [ApiController]
    [Route("api/claims")]
    public class ClaimsController : ControllerBase
    {
        private readonly IClaimService _service;

        public ClaimsController(IClaimService service)
        {
            _service = service;
        }

        // Customer submits claim
        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> CreateClaim(CreateClaimDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _service.CreateClaimAsync(dto, userId);
            return Ok("Claim submitted");
        }

        // View claims
        [Authorize(Roles = "ClaimsOfficer,Customer,Hospital")]
        [HttpGet]
        public async Task<IActionResult> GetClaims()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            return Ok(await _service.GetClaimsAsync(userId, role));
        }

        // Hospital adds notes
        [Authorize(Roles = "Hospital")]
        [HttpPut("{claimId}/medical-notes")]
        public async Task<IActionResult> AddHospitalNotes(
            int claimId, HospitalClaimUpdateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _service.AddHospitalNotesAsync(claimId, dto.HospitalNotes, userId);
            return Ok("Medical notes added");
        }

        // Claims Officer review
        [Authorize(Roles = "ClaimsOfficer")]
        [HttpPut("{claimId}/review")]
        public async Task<IActionResult> ReviewClaim(
            int claimId, ClaimReviewDto dto)
        {
            var officerId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _service.ReviewClaimAsync(claimId, dto, officerId);
            return Ok("Claim reviewed");
        }
    }

}
