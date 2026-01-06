using CapStoneAPI.DTOs.Admin;

namespace CapStoneAPI.Services.Interfaces;

public interface IInsurancePlanService
{
    Task<IEnumerable<object>> GetPlansAsync(bool isAdmin);
    Task CreatePlanAsync(CreateInsurancePlanDto dto);
    Task UpdatePlanAsync(int planId, CreateInsurancePlanDto dto);
    Task UpdatePlanStatusAsync(int planId, bool isActive);
}
