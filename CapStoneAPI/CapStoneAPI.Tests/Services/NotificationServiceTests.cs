using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class NotificationServiceTests
    {
        private readonly Mock<INotificationRepository> _mockRepo;
        private readonly NotificationService _service;

        public NotificationServiceTests()
        {
            _mockRepo = new Mock<INotificationRepository>();
            _service = new NotificationService(_mockRepo.Object);
        }

        [Fact]
        public async Task CreateNotificationAsync_ShouldCallRepoAddAsync()
        {
            // Arrange
            var userId = "test-user-id";
            var message = "Test Message";
            var type = "General";
            var refId = 123;

            // Act
            await _service.CreateNotificationAsync(userId, message, type, refId);

            // Assert
            _mockRepo.Verify(r => r.CreateAsync(It.Is<Notification>(n =>
                n.UserId == userId &&
                n.Message == message &&
                n.Type == type &&
                n.ReferenceId == refId &&
                n.IsRead == false
            )), Times.Once);

            _mockRepo.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task GetUserNotificationsAsync_All_ShouldReturnAll()
        {
            // Arrange
            var userId = "user1";
            var list = new List<Notification> { new Notification(), new Notification() };
            _mockRepo.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync(list);

            // Act
            var result = await _service.GetUserNotificationsAsync(userId, false);

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetUserNotificationsAsync_UnreadOnly_ShouldReturnUnread()
        {
            // Arrange
            var userId = "user1";
            var list = new List<Notification> { new Notification() };
            _mockRepo.Setup(r => r.GetUnreadByUserIdAsync(userId)).ReturnsAsync(list);

            // Act
            var result = await _service.GetUserNotificationsAsync(userId, true);

            // Assert
            Assert.Single(result);
            _mockRepo.Verify(r => r.GetUnreadByUserIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task MarkAsReadAsync_ShouldUpdateAndSave()
        {
            // Arrange
            var notification = new Notification { NotificationId = 1, IsRead = false };
            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(notification);

            // Act
            await _service.MarkAsReadAsync(1);

            // Assert
            Assert.True(notification.IsRead);
            _mockRepo.Verify(r => r.SaveAsync(), Times.Once);
        }
    }
}
