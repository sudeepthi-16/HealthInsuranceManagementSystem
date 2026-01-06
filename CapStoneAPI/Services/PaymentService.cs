using CapStoneAPI.Dtos.Payment;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;
using System.Security.Claims;

namespace CapStoneAPI.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepo;
        private readonly IPolicyRepository _policyRepo;
        private readonly IUserRepository _userRepo;

        public PaymentService(
            IPaymentRepository paymentRepo,
            IPolicyRepository policyRepo, IUserRepository userRepo)
        {
            _paymentRepo = paymentRepo;
            _policyRepo = policyRepo;
            _userRepo = userRepo;
        }

        //  Annual Premium Payment (Customer)
        public async Task MakePremiumPaymentAsync(
            MakePremiumPaymentDto dto, string customerId)
        {
            var policy = await _policyRepo.GetByIdAsync(dto.PolicyId)
                ?? throw new ApplicationException("Policy not found");

            // Ownership check
            if (policy.UserId != customerId)
                throw new UnauthorizedAccessException();

            // Policy state checks
            if (policy.Status != "Active")
                throw new ApplicationException("Policy is not active");

            // Already paid check
            if (policy.PremiumStatus == "Paid")
                throw new ApplicationException("Premium already paid for this period");

            // Enforce full annual payment
            if (dto.Amount != policy.TotalPremium)
                throw new ApplicationException(
                    $"Only Full annual premium of {policy.TotalPremium} must be paid");

            // Record payment
            var payment = new Payment
            {
                PolicyId = policy.PolicyId,
                Amount = dto.Amount,
                PaymentType = "Premium",
                Status = "Completed"
            };

            await _paymentRepo.AddAsync(payment);

            // Update policy state
            policy.PremiumStatus = "Paid";
            policy.NextDueDate = policy.NextDueDate.HasValue
    ? policy.NextDueDate.Value.AddMonths(12)
    : DateTime.UtcNow.AddMonths(12);


            await _paymentRepo.SaveAsync();
        }

        //  Claim payout (called from ClaimService)
        public async Task RecordClaimPayoutAsync(ClaimsTable claim)
        {
            if (claim.ApprovedAmount == null)
                throw new ApplicationException("Approved amount missing");
            if (claim.Status == "Paid")
                throw new ApplicationException("Claim already settled");


            var payment = new Payment
            {
                PolicyId = claim.PolicyId,
                ClaimId = claim.ClaimsTableId,
                Amount = claim.ApprovedAmount.Value,
                PaymentType = "Claim",
                Status = "Completed"
            };

            claim.Status = "Paid";

            await _paymentRepo.AddAsync(payment);
            await _paymentRepo.SaveAsync();
        }

        //  View payment history
    public async Task<List<PaymentResponseDto>> GetPaymentsAsync(
    string userId, string role)
    {
        var payments = await _paymentRepo.GetAllAsync();

        var currentUser = await _userRepo.GetByIdAsync(userId)
            ?? throw new ApplicationException("User not found");

        var filtered = role switch
        {
            "InsuranceAgent" => payments,

            "ClaimsOfficer" => payments,

            "Customer" => payments.Where(p =>
                p.Policy != null &&
                p.Policy.UserId == userId),

            "Hospital" => payments.Where(p =>
                p.PaymentType == "Claim" &&
                p.Claim != null &&
                currentUser.HospitalId != null &&
                p.Claim.HospitalId == currentUser.HospitalId),

            _ => Enumerable.Empty<Payment>()
        };

        return filtered.Select(p => new PaymentResponseDto
        {
            PaymentId = p.PaymentId,

            HospitalName = p.PaymentType == "Claim"
    ? p.Claim?.Hospital?.HospitalName
    : "payment to Capstone Insurance",

            Amount = p.Amount,

            CustomerCode = p.Policy?.User?.CustomerCode,
            UserFullName = p.Policy?.User?.FullName,

            PaymentType = p.PaymentType,
            PaymentDate = p.PaymentDate,
            ClaimId = p.ClaimId
        }).ToList();
    }

}


}
