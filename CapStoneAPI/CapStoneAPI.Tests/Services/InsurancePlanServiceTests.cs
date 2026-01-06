using CapStoneAPI.Dtos;
using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class InsurancePlanServiceTests
    {
        private readonly Mock<IInsurancePlanRepository> _mockRepo;
        private readonly InsurancePlanService _service;

        public InsurancePlanServiceTests()
        {
            _mockRepo = new Mock<IInsurancePlanRepository>();
            _service = new InsurancePlanService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetPlansAsync_Admin_ReturnsAllPlans()
        {
            // Arrange
            var plans = new List<InsurancePlan>
            {
                new InsurancePlan { PlanName = "Plan1", IsActive = true },
                new InsurancePlan { PlanName = "Plan2", IsActive = false }
            };
            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(plans);

            // Act
            var result = (IEnumerable<dynamic>) await _service.GetPlansAsync(true);

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetPlansAsync_Public_ReturnsActiveOnly()
        {
            // Arrange
            var plans = new List<InsurancePlan>
            {
                new InsurancePlan { PlanName = "Plan1", IsActive = true },
                new InsurancePlan { PlanName = "Plan2", IsActive = false }
            };
            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(plans);

            // Act
            var result = await _service.GetPlansAsync(false);

            // Assert
            Assert.Single(result);
        }

        [Fact]
        public async Task CreatePlanAsync_Valid_CalculatesPremiumAndCreates()
        {
            // Arrange
            var dto = new CreateInsurancePlanDto
            {
                PlanName = "Gold",
                CoverageAmount = 10000,
                DurationMonths = 12,
                Description = "Desc"
            };

            // Act
            await _service.CreatePlanAsync(dto);

            // Assert
            _mockRepo.Verify(r => r.AddAsync(It.Is<InsurancePlan>(p =>
                p.CoverageAmount == 10000 &&
                p.BasePremium == 500 && // 5% of 10000
                p.IsActive == true
            )), Times.Once);
            _mockRepo.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdatePlanAsync_Valid_UpdatesAndRecalculates()
        {
            // Arrange
            var plan = new InsurancePlan { InsurancePlanId = 1, CoverageAmount = 1000, BasePremium = 50 };
            var dto = new CreateInsurancePlanDto { CoverageAmount = 2000, PlanName = "Updated" };

            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(plan);

            // Act
            await _service.UpdatePlanAsync(1, dto);

            // Assert
            Assert.Equal(2000, plan.CoverageAmount);
            Assert.Equal(100, plan.BasePremium); // 5% of 2000
            _mockRepo.Verify(r => r.SaveAsync(), Times.Once);
        }
    }
}
