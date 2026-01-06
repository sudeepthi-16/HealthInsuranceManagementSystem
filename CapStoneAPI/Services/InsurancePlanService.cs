using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Dtos;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;

namespace CapStoneAPI.Services;

public class InsurancePlanService : IInsurancePlanService
{
    private readonly IInsurancePlanRepository _repo;

    public InsurancePlanService(IInsurancePlanRepository repo)
    {
        _repo = repo;
    }

    //  View plans (role-based visibility handled via activeOnly)
     public async Task<IEnumerable<object>> GetPlansAsync(bool isAdmin)
    {
        var plans = await _repo.GetAllAsync();

        if (isAdmin)
        {
            return plans
                .OrderBy(p => p.CreatedAt)
                .Select((p, i) => new InsurancePlanAdminResponseDto
                {
                    PlanId = p.InsurancePlanId,
                    PlanName = p.PlanName,
                    CoverageAmount = p.CoverageAmount,
                    BasePremium = p.BasePremium,
                    DurationMonths = p.DurationMonths,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    Description=p.Description
                })
                .ToList();
        }

        return plans
            .Where(p => p.IsActive)
            .OrderBy(p => p.CreatedAt)
            .Select((p, i) => new InsurancePlanPublicResponseDto
            {
                PlanId = p.InsurancePlanId,
                PlanName = p.PlanName,
                CoverageAmount = p.CoverageAmount,
                BasePremium = p.BasePremium,
                DurationMonths = p.DurationMonths,
                Description = p.Description
            })
            .ToList();
    }

    //  Create plan (Admin)
    public async Task CreatePlanAsync(CreateInsurancePlanDto dto)
    {
        var premium = dto.CoverageAmount * 0.05m; //  5% system-generated

        var plan = new InsurancePlan
        {
            PlanName = dto.PlanName,
            CoverageAmount = dto.CoverageAmount,
            DurationMonths = dto.DurationMonths,
            Description = dto.Description,
            BasePremium = premium,
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        await _repo.AddAsync(plan);
        await _repo.SaveAsync();
    }

    //  Update plan (Admin)
    public async Task UpdatePlanAsync(int planId, CreateInsurancePlanDto dto)
    {
        var plan = await _repo.GetByIdAsync(planId)
            ?? throw new ApplicationException("Insurance plan not found");

        plan.PlanName = dto.PlanName;
        plan.CoverageAmount = dto.CoverageAmount;
        plan.DurationMonths = dto.DurationMonths;
        plan.Description = dto.Description;

        //  Recalculate premium on update
        plan.BasePremium = dto.CoverageAmount * 0.05m;

        await _repo.SaveAsync();
    }

    //  Activate / Deactivate (Admin)
    public async Task UpdatePlanStatusAsync(int planId, bool isActive)
    {
        var plan = await _repo.GetByIdAsync(planId)
            ?? throw new ApplicationException("Insurance plan not found");

        plan.IsActive = isActive;
        await _repo.SaveAsync();
    }
}
