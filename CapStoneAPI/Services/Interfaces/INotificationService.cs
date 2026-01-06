using CapStoneAPI.Models;

namespace CapStoneAPI.Services.Interfaces
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(string userId, string message, string type, int? referenceId);
        Task<List<Notification>> GetUserNotificationsAsync(string userId, bool unreadOnly = false);
        Task MarkAsReadAsync(int notificationId);
    }
}
