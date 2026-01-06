using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;

namespace CapStoneAPI.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repo;

        public NotificationService(INotificationRepository repo)
        {
            _repo = repo;
        }

        public async Task CreateNotificationAsync(string userId, string message, string type, int? referenceId)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                Type = type,
                ReferenceId = referenceId,
                CreatedAt = DateTime.Now,
                IsRead = false
            };
            await _repo.CreateAsync(notification);
            await _repo.SaveAsync();
        }

        public async Task<List<Notification>> GetUserNotificationsAsync(string userId, bool unreadOnly = false)
        {
            if (unreadOnly)
            {
                return await _repo.GetUnreadByUserIdAsync(userId);
            }
            return await _repo.GetByUserIdAsync(userId);
        }

        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await _repo.GetByIdAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                await _repo.SaveAsync();
            }
        }
    }
}
