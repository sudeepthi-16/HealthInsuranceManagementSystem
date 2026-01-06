using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using CapStoneAPI.Tests.TestHelpers;
using Microsoft.AspNetCore.Identity;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _mockRepo;
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IHospitalRepository> _mockHospitalRepo;
        private readonly UserService _service;

        public UserServiceTests()
        {
            _mockRepo = new Mock<IUserRepository>();
            _mockUserManager = MockHelpers.MockUserManager<ApplicationUser>();
            _mockHospitalRepo = new Mock<IHospitalRepository>();

            _service = new UserService(
                _mockRepo.Object,
                _mockUserManager.Object,
                _mockHospitalRepo.Object
            );
        }

        [Fact]
        public async Task CreateHospitalManagerAsync_Valid_CreatesUserAndAssignsRole()
        {
            // Arrange
            var dto = new CreateHospitalManagerDto
            {
                HospitalId = 1,
                Email = "manager@hospital.com",
                FullName = "Manager",
                Password = "Password123!"
            };

            var hospital = new Hospital { HospitalId = 1, IsActive = true };

            _mockHospitalRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(hospital);
            _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), dto.Password))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(m => m.AddToRoleAsync(It.IsAny<ApplicationUser>(), "Hospital"))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            await _service.CreateHospitalManagerAsync(dto);

            // Assert
            _mockUserManager.Verify(m => m.CreateAsync(It.Is<ApplicationUser>(u =>
                u.Email == dto.Email &&
                u.HospitalId == 1 &&
                u.FullName == dto.FullName
            ), dto.Password), Times.Once);

            _mockUserManager.Verify(m => m.AddToRoleAsync(It.IsAny<ApplicationUser>(), "Hospital"), Times.Once);
        }

        [Fact]
        public async Task CreateHospitalManagerAsync_InactiveHospital_ThrowsException()
        {
            // Arrange
            var dto = new CreateHospitalManagerDto { HospitalId = 1 };
            var hospital = new Hospital { HospitalId = 1, IsActive = false };

            _mockHospitalRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(hospital);

            // Act & Assert
            await Assert.ThrowsAsync<ApplicationException>(() => _service.CreateHospitalManagerAsync(dto));
        }

        [Fact]
        public async Task UpdateUserStatusAsync_AdminDisablingSelf_ThrowsException()
        {
            // Arrange
            var adminId = "admin1";
            
            // Act & Assert
            await Assert.ThrowsAsync<ApplicationException>(() => 
                _service.UpdateUserStatusAsync(adminId, false, adminId));
        }

        [Fact]
        public async Task UpdateUserStatusAsync_Valid_UpdatesStatus()
        {
            // Arrange
            var targetId = "user1";
            var adminId = "admin1";
            var user = new ApplicationUser { Id = "user1", IsActive = true };

            _mockRepo.Setup(r => r.GetByIdAsync(targetId)).ReturnsAsync(user);

            // Act
            await _service.UpdateUserStatusAsync(targetId, false, adminId);

            // Assert
            Assert.False(user.IsActive);
            _mockRepo.Verify(r => r.SaveAsync(), Times.Once);
        }
    }
}
