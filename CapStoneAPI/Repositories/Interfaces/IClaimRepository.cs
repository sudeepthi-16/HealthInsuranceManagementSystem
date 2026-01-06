using System.Security.Claims;
using CapStoneAPI.Models;

namespace CapStoneAPI.Repositories.Interfaces
{
    public interface IClaimRepository
    {
        Task<List<ClaimsTable>> GetAllAsync();
        Task<ClaimsTable?> GetByIdAsync(int claimId);
        Task AddAsync(ClaimsTable claim);
        Task SaveAsync();
    }
}
