using CapStoneAPI.Models;

namespace CapStoneAPI.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task CreateAsync(Notification notification);
        Task<List<Notification>> GetByUserIdAsync(string userId);
        Task<List<Notification>> GetUnreadByUserIdAsync(string userId);
        Task<Notification?> GetByIdAsync(int id);
        Task SaveAsync();
    }
}
