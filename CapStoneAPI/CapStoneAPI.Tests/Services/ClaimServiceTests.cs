using CapStoneAPI.Dtos.Claims;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using CapStoneAPI.Services.Interfaces;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class ClaimServiceTests
    {
        private readonly Mock<IClaimRepository> _mockClaimRepo;
        private readonly Mock<IPolicyRepository> _mockPolicyRepo;
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<IPaymentService> _mockPaymentService;
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly ClaimService _service;

        public ClaimServiceTests()
        {
            _mockClaimRepo = new Mock<IClaimRepository>();
            _mockPolicyRepo = new Mock<IPolicyRepository>();
            _mockUserRepo = new Mock<IUserRepository>();
            _mockPaymentService = new Mock<IPaymentService>();
            _mockNotificationService = new Mock<INotificationService>();

            _service = new ClaimService(
                _mockClaimRepo.Object,
                _mockPolicyRepo.Object,
                _mockUserRepo.Object,
                _mockPaymentService.Object,
                _mockNotificationService.Object
            );
        }

        [Fact]
        public async Task CreateClaimAsync_Valid_CreatesClaimAndNotifies()
        {
            // Arrange
            var dto = new CreateClaimDto { PolicyId = 1, ClaimAmount = 500 };
            var policy = new Policy
            {
                PolicyId = 1,
                UserId = "user1",
                Status = "Active",
                Plan = new InsurancePlan { CoverageAmount = 1000 }
            };

            _mockPolicyRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(policy);

            // Act
            await _service.CreateClaimAsync(dto, "user1");

            // Assert
            _mockClaimRepo.Verify(r => r.AddAsync(It.Is<ClaimsTable>(c =>
                c.PolicyId == 1 &&
                c.ClaimAmount == 500 &&
                c.Status == "Submitted"
            )), Times.Once);

            _mockClaimRepo.Verify(r => r.SaveAsync(), Times.Once);
            _mockNotificationService.Verify(n => n.CreateNotificationAsync(
                "user1", It.IsAny<string>(), "Claim", It.IsAny<int>()
            ), Times.Once);
        }

        [Fact]
        public async Task CreateClaimAsync_ExceedsCoverage_ThrowsException()
        {
            // Arrange
            var dto = new CreateClaimDto { PolicyId = 1, ClaimAmount = 600 };
            var policy = new Policy
            {
                PolicyId = 1,
                UserId = "user1",
                Status = "Active",
                Plan = new InsurancePlan { CoverageAmount = 1000 },
                Claims = new List<ClaimsTable>
                {
                    new ClaimsTable { Status = "Approved", ApprovedAmount = 500 }
                }
            };

            _mockPolicyRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(policy);

            // Act & Assert
            await Assert.ThrowsAsync<ApplicationException>(() => _service.CreateClaimAsync(dto, "user1"));
        }

        [Fact]
        public async Task AddHospitalNotesAsync_Valid_UpdatesNotesAndStatus()
        {
            // Arrange
            var claim = new ClaimsTable 
            { 
                ClaimsTableId = 1, 
                Status = "Submitted", 
                HospitalId = 10,
                Hospital = new Hospital { IsActive = true },
                Policy = new Policy { UserId = "user1" }
            };
            var user = new ApplicationUser { Id = "hospUser", HospitalId = 10 };

            _mockClaimRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(claim);
            _mockUserRepo.Setup(r => r.GetByIdAsync("hospUser")).ReturnsAsync(user);

            // Act
            await _service.AddHospitalNotesAsync(1, "Notes", "hospUser");

            // Assert
            Assert.Equal("InReview", claim.Status);
            Assert.Equal("Notes", claim.HospitalNotes);
            _mockClaimRepo.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task ReviewClaimAsync_Approve_UpdatesStatusAndTriggersPayment()
        {
            // Arrange
            var claim = new ClaimsTable 
            { 
                ClaimsTableId = 1, 
                Status = "InReview", 
                ClaimAmount = 1000,
                Policy = new Policy { UserId = "user1" }
            };
            var dto = new ClaimReviewDto { IsApproved = true, ApprovedAmount = 800, OfficerRemarks = "OK" };

            _mockClaimRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(claim);

            // Act
            await _service.ReviewClaimAsync(1, dto, "officer1");

            // Assert
            Assert.Equal("Approved", claim.Status);
            Assert.Equal(800, claim.ApprovedAmount);
            _mockPaymentService.Verify(p => p.RecordClaimPayoutAsync(claim), Times.Once);
            _mockClaimRepo.Verify(r => r.SaveAsync(), Times.Once);
        }
    }
}
