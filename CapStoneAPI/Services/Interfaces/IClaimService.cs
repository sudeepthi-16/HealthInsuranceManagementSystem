using CapStoneAPI.Dtos.Claims;

namespace CapStoneAPI.Services.Interfaces
{
    public interface IClaimService
    {
        Task CreateClaimAsync(CreateClaimDto dto, string customerId);
        Task<List<object>> GetClaimsAsync(string userId, string role);
        Task AddHospitalNotesAsync(int claimId, string notes, string userId);
        Task ReviewClaimAsync(int claimId, ClaimReviewDto dto, string officerId);
    }

}
