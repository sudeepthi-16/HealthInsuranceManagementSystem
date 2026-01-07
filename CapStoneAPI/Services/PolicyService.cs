using CapStoneAPI.DTOs.Policy;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;

namespace CapStoneAPI.Services;

public class PolicyService : IPolicyService
{
    private readonly IPolicyRepository _policyRepo;
    private readonly IUserRepository _userRepo;
    private readonly IInsurancePlanRepository _planRepo;
    private readonly IHospitalRepository _hospitalRepo;
    private readonly INotificationService _notificationService;

    public PolicyService(
        IPolicyRepository policyRepo,
        IUserRepository userRepo,
        IInsurancePlanRepository planRepo,
        IHospitalRepository hospitalRepo,
        INotificationService notificationService)
    {
        _policyRepo = policyRepo;
        _userRepo = userRepo;
        _planRepo = planRepo;
        _hospitalRepo = hospitalRepo;
        _notificationService = notificationService;
    }

    //  CREATE POLICY (Insurance Agent)
    public async Task CreatePolicyAsync(CreatePolicyDto dto, string agentId)
    {
        var customer = await _userRepo.GetByIdAsync(dto.CustomerId)
            ?? throw new ApplicationException("Customer not found");

        if (!customer.IsActive)
            throw new ApplicationException("Inactive customer");

        var plan = await _planRepo.GetByIdAsync(dto.PlanId)
            ?? throw new ApplicationException("Plan not found");

        if (!plan.IsActive)
            throw new ApplicationException("Inactive plan");

        var policy = new Policy
        {
            PolicyNumber = $"POL-{Guid.NewGuid():N}".Substring(0, 12),
            UserId = dto.CustomerId,
            PlanId = dto.PlanId,

            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddMonths(plan.DurationMonths),

            TotalPremium = plan.CoverageAmount * 0.05m,
            PremiumStatus = "Due",
            NextDueDate = DateTime.Today,

            Status = "Active",
            CreatedByUserId = agentId
        };

        await _policyRepo.AddAsync(policy);
        await _policyRepo.SaveAsync();

        await _notificationService.CreateNotificationAsync(
            policy.UserId,
            $"Policy with ID {policy.PolicyId} has been created.",
            "Policy",
            policy.PolicyId);
    }

    //  GET POLICIES (ROLE FILTERED)
    public async Task<List<PolicyResponseDto>> GetPoliciesAsync(
        string userId, string role)
    {
        var policies = await _policyRepo.GetAllAsync();
        await UpdateExpiredPoliciesAsync(policies);
        UpdatePremiumDueStatus(policies); //added now

        IEnumerable<Policy> filtered = role switch
        {
            "Admin" or "InsuranceAgent" => policies,

            "Customer" => policies.Where(p => p.UserId == userId),

           

            _ => throw new UnauthorizedAccessException()
        };

        return filtered.Select(MapToDto).ToList();
    }

    //  GET SINGLE POLICY
    public async Task<PolicyResponseDto> GetPolicyByIdAsync(
        int policyId, string userId, string role)
    {
        var policy = await _policyRepo.GetByIdAsync(policyId)
            ?? throw new ApplicationException("Policy not found");

        await UpdateExpiredPoliciesAsync(new List<Policy> { policy });
        UpdatePremiumDueStatus(new List<Policy> { policy });

        if (role == "Customer" && policy.UserId != userId)
            throw new UnauthorizedAccessException();

        

        return MapToDto(policy);
    }

    //  SUSPEND POLICY (Insurance Agent)
    public async Task SuspendPolicyAsync(int policyId)
    {
        var policy = await _policyRepo.GetByIdAsync(policyId)
            ?? throw new ApplicationException("Policy not found");

        if (policy.Status != "Active")
            throw new ApplicationException("Only active policies can be suspended");

        policy.Status = "Suspended";
        await _policyRepo.SaveAsync();

        await _notificationService.CreateNotificationAsync(
            policy.UserId,
            $"Policy with ID {policy.PolicyId} has been suspended.",
            "Policy",
            policy.PolicyId);
    }

    //  RENEW POLICY (Insurance Agent)
    public async Task RenewPolicyAsync(int policyId, int additionalMonths)
    {
        var policy = await _policyRepo.GetByIdAsync(policyId)
            ?? throw new ApplicationException("Policy not found");

        if (policy.Status == "Suspended")
            throw new ApplicationException("Suspended policy cannot be renewed");

        var coverage = policy.Plan.CoverageAmount;
        var increase = coverage * 0.02m;

        policy.EndDate = policy.EndDate.AddMonths(additionalMonths);
        policy.TotalPremium += increase;

        policy.PremiumStatus = "Due";
        policy.NextDueDate = DateTime.Today;
        policy.Status = "Active";

        await _policyRepo.SaveAsync();

        await _notificationService.CreateNotificationAsync(
            policy.UserId,
            $"Policy with ID {policy.PolicyId} has been renewed.",
            "Policy",
            policy.PolicyId);
    }

    // AUTO EXPIRY
    private async Task UpdateExpiredPoliciesAsync(IEnumerable<Policy> policies)
    {
        foreach (var policy in policies)
        {
            if (policy.EndDate < DateTime.Today && policy.Status != "Expired")
            {
                policy.Status = "Expired";
                
                
                await _notificationService.CreateNotificationAsync(
                    policy.UserId,
                    $"Policy with ID {policy.PolicyId} has expired.",
                    "Policy",
                    policy.PolicyId);
            }
        }
    }
    
    private static void UpdatePremiumDueStatus(IEnumerable<Policy> policies)
    {
        foreach (var policy in policies)
        {
            if (policy.Status == "Active" &&
                policy.NextDueDate.HasValue &&
                policy.NextDueDate < DateTime.Today)
            {
                policy.PremiumStatus = "Due";
            }
        }
    }


    private static PolicyResponseDto MapToDto(Policy p) => new()
    {
        PolicyId = p.PolicyId,
        

        UserId = p.UserId,
        UserName = p.User.FullName ?? p.User.Email,
        CustomerCode = p.User.CustomerCode,

        
        Status = p.Status,
        PremiumStatus = p.PremiumStatus,

        StartDate = p.StartDate,
        EndDate = p.EndDate,
        NextDueDate = p.NextDueDate,

        TotalPremium = p.TotalPremium,
        PlanId = p.PlanId,

        PlanName = p.Plan?.PlanName ?? "Unknown Plan",
        CoverageAmount = p.Plan?.CoverageAmount ?? 0,
        ClaimsUsedAmount = p.Claims?
            .Where(c => c.Status == "Approved" || c.Status == "Paid")
            .Sum(c => c.ApprovedAmount ?? 0) ?? 0
    };
}

