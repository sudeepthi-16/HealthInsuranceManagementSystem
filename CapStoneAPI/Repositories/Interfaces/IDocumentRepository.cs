using CapStoneAPI.Dtos.Claims;
using CapStoneAPI.Models;

namespace CapStoneAPI.Repositories.Interfaces
{
    public interface IDocumentRepository
    {
        Task AddDocumentAsync(ClaimDocument document);
        Task<IEnumerable<ClaimDocument>> GetDocumentsByClaimIdAsync(int claimId);
        Task<ClaimDocument> GetDocumentByIdAsync(int id);
        Task<ClaimsTable> GetClaimByIdAsync(int claimId);
    }
}
