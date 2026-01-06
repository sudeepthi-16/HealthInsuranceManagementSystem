using CapStoneAPI.Models;

namespace CapStoneAPI.Repositories.Interfaces;

public interface IPolicyRepository
{
    Task<List<Policy>> GetAllAsync();
    Task<Policy?> GetByIdAsync(int policyId);
    Task AddAsync(Policy policy);
    Task SaveAsync();
}
