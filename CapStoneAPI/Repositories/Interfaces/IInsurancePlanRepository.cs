using CapStoneAPI.Models;

namespace CapStoneAPI.Repositories.Interfaces;

public interface IInsurancePlanRepository
{
    Task<List<InsurancePlan>> GetAllAsync();
    Task<InsurancePlan?> GetByIdAsync(int planId);
    Task AddAsync(InsurancePlan plan);
    Task SaveAsync();
}
