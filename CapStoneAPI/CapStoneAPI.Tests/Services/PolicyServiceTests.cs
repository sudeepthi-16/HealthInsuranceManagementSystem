using CapStoneAPI.DTOs.Policy;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using CapStoneAPI.Services.Interfaces;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class PolicyServiceTests
    {
        private readonly Mock<IPolicyRepository> _mockPolicyRepo;
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<IInsurancePlanRepository> _mockPlanRepo;
        private readonly Mock<IHospitalRepository> _mockHospitalRepo;
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly PolicyService _service;

        public PolicyServiceTests()
        {
            _mockPolicyRepo = new Mock<IPolicyRepository>();
            _mockUserRepo = new Mock<IUserRepository>();
            _mockPlanRepo = new Mock<IInsurancePlanRepository>();
            _mockHospitalRepo = new Mock<IHospitalRepository>();
            _mockNotificationService = new Mock<INotificationService>();

            _service = new PolicyService(
                _mockPolicyRepo.Object,
                _mockUserRepo.Object,
                _mockPlanRepo.Object,
                _mockHospitalRepo.Object,
                _mockNotificationService.Object
            );
        }

        [Fact]
        public async Task CreatePolicyAsync_ValidInputs_ShouldCreatePolicyAndNotify()
        {
            // Arrange
            var dto = new CreatePolicyDto { CustomerId = "cust1", PlanId = 1 };
            var agentId = "agent1";

            var customer = new ApplicationUser { Id = "cust1", IsActive = true };
            var plan = new InsurancePlan { InsurancePlanId = 1, IsActive = true, DurationMonths = 12, CoverageAmount = 10000 };

            _mockUserRepo.Setup(r => r.GetByIdAsync("cust1")).ReturnsAsync(customer);
            _mockPlanRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(plan);

            // Act
            await _service.CreatePolicyAsync(dto, agentId);

            // Assert
            _mockPolicyRepo.Verify(r => r.AddAsync(It.Is<Policy>(p =>
                p.UserId == "cust1" &&
                p.PlanId == 1 &&
                p.TotalPremium == 500 && // 5% of 10000
                p.Status == "Active"
            )), Times.Once);

            _mockPolicyRepo.Verify(r => r.SaveAsync(), Times.Once);

            // Verify notification
            _mockNotificationService.Verify(n => n.CreateNotificationAsync(
                "cust1",
                It.Is<string>(s => s.Contains("created")),
                "Policy",
                It.IsAny<int>() // PolicyId might be 0 until saved if mocking EF
            ), Times.Once);
        }

        [Fact]
        public async Task CreatePolicyAsync_InactiveCustomer_ThrowsException()
        {
            // Arrange
            var dto = new CreatePolicyDto { CustomerId = "cust1" };
            var customer = new ApplicationUser { Id = "cust1", IsActive = false };

            _mockUserRepo.Setup(r => r.GetByIdAsync("cust1")).ReturnsAsync(customer);

            // Act & Assert
            await Assert.ThrowsAsync<ApplicationException>(() => _service.CreatePolicyAsync(dto, "agent1"));
        }
    }
}
