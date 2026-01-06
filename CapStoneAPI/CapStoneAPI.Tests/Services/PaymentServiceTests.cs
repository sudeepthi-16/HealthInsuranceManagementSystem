using CapStoneAPI.Dtos.Payment;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class PaymentServiceTests
    {
        private readonly Mock<IPaymentRepository> _mockPaymentRepo;
        private readonly Mock<IPolicyRepository> _mockPolicyRepo;
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly PaymentService _service;

        public PaymentServiceTests()
        {
            _mockPaymentRepo = new Mock<IPaymentRepository>();
            _mockPolicyRepo = new Mock<IPolicyRepository>();
            _mockUserRepo = new Mock<IUserRepository>();

            _service = new PaymentService(
                _mockPaymentRepo.Object,
                _mockPolicyRepo.Object,
                _mockUserRepo.Object
            );
        }

        [Fact]
        public async Task MakePremiumPaymentAsync_Valid_CreatesPaymentAndUpdatesPolicy()
        {
            // Arrange
            var dto = new MakePremiumPaymentDto { PolicyId = 1, Amount = 1000 };
            var policy = new Policy 
            { 
                PolicyId = 1, 
                UserId = "cust1", 
                Status = "Active", 
                PremiumStatus = "Pending", 
                TotalPremium = 1000,
                NextDueDate = DateTime.Now
            };

            _mockPolicyRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(policy);

            // Act
            await _service.MakePremiumPaymentAsync(dto, "cust1");

            // Assert
            _mockPaymentRepo.Verify(r => r.AddAsync(It.Is<Payment>(p =>
                p.PolicyId == 1 &&
                p.Amount == 1000 &&
                p.PaymentType == "Premium"
            )), Times.Once);

            Assert.Equal("Paid", policy.PremiumStatus);
            _mockPaymentRepo.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task MakePremiumPaymentAsync_PartialAmount_ThrowsException()
        {
            // Arrange
            var dto = new MakePremiumPaymentDto { PolicyId = 1, Amount = 500 };
            var policy = new Policy 
            { 
                PolicyId = 1, 
                UserId = "cust1", 
                Status = "Active", 
                TotalPremium = 1000 
            };

            _mockPolicyRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(policy);

            // Act & Assert
            await Assert.ThrowsAsync<ApplicationException>(() => _service.MakePremiumPaymentAsync(dto, "cust1"));
        }

        [Fact]
        public async Task RecordClaimPayoutAsync_Valid_CreatesPayment()
        {
            // Arrange
            var claim = new ClaimsTable 
            { 
                ClaimsTableId = 1, 
                PolicyId = 1, 
                ApprovedAmount = 500, 
                Status = "Approved" 
            };

            // Act
            await _service.RecordClaimPayoutAsync(claim);

            // Assert
            _mockPaymentRepo.Verify(r => r.AddAsync(It.Is<Payment>(p =>
                p.ClaimId == 1 &&
                p.Amount == 500 &&
                p.PaymentType == "Claim"
            )), Times.Once);
            
            Assert.Equal("Paid", claim.Status);
            _mockPaymentRepo.Verify(r => r.SaveAsync(), Times.Once);
        }
    }
}
