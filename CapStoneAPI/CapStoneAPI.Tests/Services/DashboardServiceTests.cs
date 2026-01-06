using CapStoneAPI.Data;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class DashboardServiceTests
    {
        private AppDbContext _context;
        private readonly Mock<IClaimRepository> _mockClaimRepo;
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly DashboardService _service;

        public DashboardServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique DB per test
                .Options;
            
            _context = new AppDbContext(options);
            _mockClaimRepo = new Mock<IClaimRepository>();
            _mockUserRepo = new Mock<IUserRepository>();

            _service = new DashboardService(_context, _mockClaimRepo.Object, _mockUserRepo.Object);
        }

        [Fact]
        public async Task GetDashboardSummaryAsync_ReturnsCorrectTotals()
        {
            // Arrange
            _context.Payments.AddRange(
                new Payment { PaymentType = "Premium", Amount = 1000, Status = "Completed" },
                new Payment { PaymentType = "Claim", Amount = 500, Status = "Completed" }
            );
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetDashboardSummaryAsync();

            // Assert
            Assert.Equal(1000, result.TotalPremiumCollected);
            Assert.Equal(500, result.TotalClaimsPaid);
        }

        [Fact]
        public async Task GetHospitalSummaryAsync_Valid_ReturnsStats()
        {
            // Arrange
            var userId = "hospUser";
            var user = new ApplicationUser { Id = userId, HospitalId = 1 };
            _mockUserRepo.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

            var claims = new List<ClaimsTable>
            {
                new ClaimsTable { HospitalId = 1, Status = "Submitted" },
                new ClaimsTable { HospitalId = 1, Status = "Approved" },
                new ClaimsTable { HospitalId = 2, Status = "Submitted" } // Other hospital
            };
            _mockClaimRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(claims);

            // Act
            var result = await _service.GetHospitalSummaryAsync(userId);

            // Assert
            Assert.Equal(2, result.TotalClaims);
            Assert.Equal(1, result.Submitted);
            Assert.Equal(1, result.Approved);
        }
    }
}
