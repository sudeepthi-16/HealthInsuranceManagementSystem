using CapStoneAPI.Dtos.Claims;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;

namespace CapStoneAPI.Services
{
    public class ClaimService : IClaimService
    {
        private readonly IClaimRepository _claimRepo;
        private readonly IPolicyRepository _policyRepo;
        private readonly IUserRepository _userRepo;
        private readonly IPaymentService _paymentService;
        private readonly INotificationService _notificationService;

        public ClaimService(
            IClaimRepository claimRepo,
            IPolicyRepository policyRepo,
            IUserRepository userRepo,
            IPaymentService paymentService,
            INotificationService notificationService)
        {
            _claimRepo = claimRepo;
            _policyRepo = policyRepo;
            _userRepo = userRepo;
            _paymentService = paymentService;
            _notificationService = notificationService;
        }

        // 1️⃣ Customer submits claim
        public async Task CreateClaimAsync(CreateClaimDto dto, string customerId)
        {
            var policy = await _policyRepo.GetByIdAsync(dto.PolicyId)
                ?? throw new ApplicationException("Policy not found");

            if (policy.UserId != customerId)
                throw new UnauthorizedAccessException();

            if (policy.Status != "Active")
                throw new ApplicationException("Policy not active");

            // Remaining coverage validation
            var approvedClaims = policy.Claims?
                .Where(c => c.Status == "Approved" || c.Status == "Paid")
                .Sum(c => c.ApprovedAmount ?? 0) ?? 0;

            if (approvedClaims + dto.ClaimAmount > policy.Plan.CoverageAmount)
                throw new ApplicationException("Claim exceeds remaining coverage");

            var claim = new ClaimsTable
            {
                PolicyId = dto.PolicyId,
                HospitalId = dto.HospitalId,  
                HospitalNotes = "Not Added",
                ClaimAmount = dto.ClaimAmount,
                CustomerDescription = dto.CustomerDescription,
                Status = "Submitted",
                SubmittedDate = DateTime.UtcNow
            };

            await _claimRepo.AddAsync(claim);
            await _claimRepo.SaveAsync();

            await _notificationService.CreateNotificationAsync(
                policy.UserId,
                $"Claim with ID {claim.ClaimsTableId} has been submitted.",
                "Claim",
                claim.ClaimsTableId);
        }

        // 2️⃣ Role-based claim visibility
        public async Task<List<object>> GetClaimsAsync(string userId, string role)
        {
            var claims = await _claimRepo.GetAllAsync();

            var currentUser = await _userRepo.GetByIdAsync(userId)
                ?? throw new ApplicationException("User not found");

            switch (role)
            {
                case "ClaimsOfficer":
                    return claims.Select(c =>
                    {
                        var usedCoverage = c.Policy.Claims?
                            .Where(claim => claim.Status == "Approved" || claim.Status == "Paid")
                            .Sum(claim => claim.ApprovedAmount ?? 0) ?? 0;

                        return new OfficerClaimResponseDto
                        {
                            ClaimId = c.ClaimsTableId,
                            ClaimAmount = c.ClaimAmount,
                            ApprovedAmount = c.ApprovedAmount,
                            Status = c.Status,
                            SubmittedDate = c.SubmittedDate,

                            CustomerId = c.Policy.UserId,
                            CustomerName = c.Policy.User.FullName,

                            HospitalId = c.HospitalId,
                            HospitalName = c.Hospital.HospitalName,
                            HospitalNotes = c.HospitalNotes,

                            PolicyId = c.PolicyId,
                            PolicyNumber = c.Policy.PolicyNumber,
                            CoverageAmount = c.Policy.Plan.CoverageAmount,
                            PolicyStatus = c.Policy.Status,
                            PremiumStatus = c.Policy.PremiumStatus,
                            PolicyStartDate = c.Policy.StartDate,
                            PolicyEndDate = c.Policy.EndDate,

                            PlanId = c.Policy.PlanId,
                            PlanName = c.Policy.Plan.PlanName,

                            UsedCoverageAmount = usedCoverage,
                            RemainingCoverageAmount = c.Policy.Plan.CoverageAmount - usedCoverage,

                            CustomerDescription = c.CustomerDescription,
                            OfficerRemarks = c.OfficerRemarks
                        };
                    }).Cast<object>().ToList();

                case "Customer":
                    return claims.Where(c => c.Policy.UserId == userId)
                        .Select(c => new ClaimResponseDto
                        {
                            ClaimId = c.ClaimsTableId,
                            ClaimAmount = c.ClaimAmount,
                            ApprovedAmount = c.ApprovedAmount,
                            Status = c.Status,
                            SubmittedDate = c.SubmittedDate,

                            PolicyId = c.PolicyId,
                            HospitalId = c.HospitalId,
                            HospitalName=c.Hospital.HospitalName,
                            HospitalNotes = c.HospitalNotes,


                            CustomerDescription = c.CustomerDescription,
                            OfficerRemarks= c.OfficerRemarks
                            
                            
                        }).Cast<object>().ToList();

                case "Hospital":
                    return claims.Where(c =>
                        currentUser.HospitalId != null &&
                        c.HospitalId == currentUser.HospitalId)
                        .Select(c => new ClaimResponseDto
                        {
                            ClaimId = c.ClaimsTableId,
                            PolicyId = c.PolicyId,
                            HospitalId = c.HospitalId,
                            ClaimAmount = c.ClaimAmount,
                            ApprovedAmount = c.ApprovedAmount,
                            CustomerDescription = c.CustomerDescription,
                            CustomerCode = c.Policy.User.CustomerCode,
                            CustomerName = c.Policy.User.FullName,
                            Status = c.Status,
                            SubmittedDate = c.SubmittedDate
                        }).Cast<object>().ToList();

                default:
                    return new List<object>();
            }
        }

        // 3️⃣ Hospital adds medical notes
        public async Task AddHospitalNotesAsync(int claimId, string notes, string userId)
        {
            var claim = await _claimRepo.GetByIdAsync(claimId)
                ?? throw new ApplicationException("Claim not found");

            var currentUser = await _userRepo.GetByIdAsync(userId)
                ?? throw new ApplicationException("User not found");

            if (currentUser.HospitalId == null ||
                claim.HospitalId != currentUser.HospitalId)
                throw new UnauthorizedAccessException();

            if (!claim.Hospital.IsActive)
                throw new ApplicationException("Inactive hospital");

            if (claim.Status != "Submitted")
                throw new ApplicationException("Invalid claim state");

            claim.HospitalNotes = notes;
            claim.Status = "InReview";

            await _claimRepo.SaveAsync();

            await _notificationService.CreateNotificationAsync(
                claim.Policy.UserId,
                $"Claim with ID {claim.ClaimsTableId} is now under review.",
                "Claim",
                claim.ClaimsTableId);
        }

        // 4️⃣ Claims Officer review
        public async Task ReviewClaimAsync(int claimId, ClaimReviewDto dto, string officerId)
        {
            var claim = await _claimRepo.GetByIdAsync(claimId)
                ?? throw new ApplicationException("Claim not found");

            if (claim.Status != "InReview")
                throw new ApplicationException("Claim not ready for review");

            if (dto.IsApproved)
            {
                if (dto.ApprovedAmount == null ||
                    dto.ApprovedAmount <= 0 ||
                    dto.ApprovedAmount > claim.ClaimAmount)
                    throw new ApplicationException("Invalid approved amount");

                claim.Status = "Approved";
                claim.ApprovedAmount = dto.ApprovedAmount;

                await _notificationService.CreateNotificationAsync(
                   claim.Policy.UserId,
                   $"Payment for Claim {claim.ClaimsTableId} has been Approved.",
                   "Payment",
                   claim.ClaimsTableId);

                // AUTO PAYOUT
                await _paymentService.RecordClaimPayoutAsync(claim);

                await _notificationService.CreateNotificationAsync(
                    claim.Policy.UserId,
                    $"Payout of {claim.ApprovedAmount} processed under claim {claim.ClaimsTableId}",
                    "Claim",
                    claim.ClaimsTableId);
                 
                

            }
            else
            {
                claim.Status = "Rejected";

                await _notificationService.CreateNotificationAsync(
                    claim.Policy.UserId,
                    $"Claim {claim.ClaimsTableId} has been rejected. Remarks: {dto.OfficerRemarks}",
                    "Claim",
                    claim.ClaimsTableId);
            }

            claim.OfficerRemarks = dto.OfficerRemarks;
            claim.ReviewedByUserId = officerId;

            await _claimRepo.SaveAsync();
        }
    }
}

