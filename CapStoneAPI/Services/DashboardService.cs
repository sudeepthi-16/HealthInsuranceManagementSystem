using CapStoneAPI.Data;
using CapStoneAPI.Dtos.Dashboard;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;
        private readonly IClaimRepository _claimRepo;
        private readonly IUserRepository _userRepo;

        public DashboardService(AppDbContext context, IClaimRepository claimRepo,
            IUserRepository userRepo)
        {
            _context = context;
            _claimRepo = claimRepo;
            _userRepo = userRepo;
        }

        // 1️ Premium vs Claim
        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            var premiumTotal = await _context.Payments
                .Where(p => p.PaymentType == "Premium")
                .SumAsync(p => p.Amount);

            var claimTotal = await _context.Payments
                .Where(p => p.PaymentType == "Claim")
                .SumAsync(p => p.Amount);

            return new DashboardSummaryDto
            {
                TotalPremiumCollected = premiumTotal,
                TotalClaimsPaid = claimTotal
            };
        }

        // 1.1 Hospital Summary
        public async Task<HospitalSummaryDto> GetHospitalSummaryAsync(string userId)
        {
            var user = await _userRepo.GetByIdAsync(userId)
                ?? throw new ApplicationException($"User not found (ID: {userId})");

            if (user.HospitalId == null)
                throw new ApplicationException($"Hospital not linked to this user (User: {user.FullName}, Email: {user.Email}). Please ask Admin to recreate this Hospital Manager.");

            var claims = await _claimRepo.GetAllAsync();
            var myClaims = claims.Where(c => c.HospitalId == user.HospitalId).ToList();

            return new HospitalSummaryDto
            {
                TotalClaims = myClaims.Count,
                Submitted = myClaims.Count(c => c.Status == "Submitted"),
                InReview = myClaims.Count(c => c.Status == "InReview"),
                Approved = myClaims.Count(c => c.Status == "Approved"),
                Rejected = myClaims.Count(c => c.Status == "Rejected"),
                Paid = myClaims.Count(c => c.Status == "Paid")
            };
        }

        //  Officer-wise claims
        public async Task<List<ClaimsByOfficerDto>> GetClaimsByOfficerAsync()
        {
            return await _context.Claims
                .Where(c => c.ReviewedByUserId != null)
                .GroupBy(c => c.ReviewedByUser.FullName)
                .Select(g => new ClaimsByOfficerDto
                {
                    OfficerName = g.Key,
                    Approved = g.Count(c => c.Status == "Approved" || c.Status == "Paid"),
                    Rejected = g.Count(c => c.Status == "Rejected")
                })
                .ToListAsync();
        }

        //  Policies by status
        public async Task<List<CountByStatusDto>> GetPoliciesByStatusAsync()
        {
            return await _context.Policies
                .GroupBy(p => p.Status)
                .Select(g => new CountByStatusDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();
        }

        // 4️ Claims by status
        public async Task<List<CountByStatusDto>> GetClaimsByStatusAsync()
        {
            return await _context.Claims
                .GroupBy(c => c.Status)
                .Select(g => new CountByStatusDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();
        }

        // 5️ Claims by hospital
        public async Task<List<ClaimsByHospitalDto>> GetClaimsByHospitalAsync()
        {
            return await _context.Claims
                .GroupBy(c => c.Hospital.HospitalName)
                .Select(g => new ClaimsByHospitalDto
                {
                    HospitalName = g.Key,
                    ClaimCount = g.Count(),
                    TotalAmount = g.Sum(c => c.ClaimAmount)
                })
                .ToListAsync();
        }
        
        
        // 6️ High Value Claims (Utilization > 70%)
        public async Task<List<HighValueClaimDto>> GetHighValueClaimsAsync()
        {
            var policies = await _context.Policies
                .Include(p => p.User)
                .Include(p => p.Plan)
                .Include(p => p.Claims)
                .ToListAsync();

            var highValueList = new List<HighValueClaimDto>();

            foreach (var policy in policies)
            {
                // Calculate Total Payout (Approved/Paid claims)
                var totalPayout = policy.Claims
                    .Where(c => c.Status == "Approved" || c.Status == "Paid")
                    .Sum(c => c.ApprovedAmount ?? 0); // Use ApprovedAmount

                var coverage = policy.Plan.CoverageAmount;

                // Check if utilization > 70%
                if (totalPayout >= coverage * 0.7m)
                {
                    highValueList.Add(new HighValueClaimDto
                    {
                        PolicyId = policy.PolicyId,
                        CustomerName = policy.User?.FullName ?? "Unknown",
                        TotalAmountUsed = totalPayout,
                        CoverageAmount = coverage
                    });
                }
            }

            return highValueList.OrderByDescending(x => x.TotalAmountUsed).ToList();
        }
    }

}
