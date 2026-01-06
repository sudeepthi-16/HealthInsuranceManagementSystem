using CapStoneAPI.Models;

namespace CapStoneAPI.Repositories.Interfaces;

public interface IHospitalRepository
{
    Task<List<Hospital>> GetAllAsync();
    Task<Hospital?> GetByUserIdAsync(string userId);

    Task<Hospital?> GetByIdAsync(int hospitalId);
    Task AddAsync(Hospital hospital);
    Task SaveAsync();
}
