using CapStoneAPI.Models;

namespace CapStoneAPI.Repositories.Interfaces;

public interface IUserRepository
{
    Task<List<ApplicationUser>> GetAllUsersAsync();
    Task<ApplicationUser?> GetByIdAsync(string userId);
    Task SaveAsync();
}
