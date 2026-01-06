using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CapStoneAPI.Controllers;

[ApiController]
[Route("api/plans")]
public class InsurancePlansController : ControllerBase
{
    private readonly IInsurancePlanService _service;

    public InsurancePlansController(IInsurancePlanService service)
    {
        _service = service;
    }

    //  Browse plans
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetPlans()
    {
        var isAdmin =
            User.Identity?.IsAuthenticated == true &&
            User.IsInRole("Admin");

        return Ok(await _service.GetPlansAsync(isAdmin));
    }


    //  Create plan
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreatePlan(CreateInsurancePlanDto dto)
    {
        await _service.CreatePlanAsync(dto);
        return Ok(new{ message = "Insurance plan created"});
    }

    //  Update plan
    [Authorize(Roles = "Admin")]
    [HttpPut("{planId}")]
    public async Task<IActionResult> UpdatePlan(
        int planId, CreateInsurancePlanDto dto)
    {
        await _service.UpdatePlanAsync(planId, dto);
        return Ok(new { message = "Insurance plan updated" });
    }

    //  Activate / Deactivate
    [Authorize(Roles = "Admin")]
    [HttpPut("{planId}/status")]
    public async Task<IActionResult> UpdatePlanStatus(
        int planId, UpdateStatusDto dto)
    {
        await _service.UpdatePlanStatusAsync(planId, dto.IsActive);
        return Ok(new { message = "Plan status updated" });
    }
}
