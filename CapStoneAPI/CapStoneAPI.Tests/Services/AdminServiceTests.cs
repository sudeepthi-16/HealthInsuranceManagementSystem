using CapStoneAPI.Data;
using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using CapStoneAPI.Tests.TestHelpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class AdminServiceTests
    {
        private AppDbContext _context;
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IHospitalRepository> _mockHospitalRepo;
        private readonly AdminService _service;

        public AdminServiceTests()
        {
             var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new AppDbContext(options);

            _mockUserManager = MockHelpers.MockUserManager<ApplicationUser>();
            _mockHospitalRepo = new Mock<IHospitalRepository>();

            _service = new AdminService(_context, _mockUserManager.Object, _mockHospitalRepo.Object);
        }

        [Fact]
        public async Task CreateHospitalManagerAsync_Valid_CreatesManager()
        {
            // Arrange
            var dto = new CreateHospitalManagerDto { HospitalId = 1, Email = "test@test.com", FullName = "Mgr" };
            var hospital = new Hospital { HospitalId = 1, IsActive = true };

            _mockHospitalRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(hospital);
            _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(m => m.AddToRoleAsync(It.IsAny<ApplicationUser>(), "Hospital"))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            await _service.CreateHospitalManagerAsync(dto);

            // Assert
            _mockUserManager.Verify(m => m.CreateAsync(It.Is<ApplicationUser>(u => 
                u.Email == dto.Email && u.HospitalId == 1
            ), It.IsAny<string>()), Times.Once);
        }
    }
}
