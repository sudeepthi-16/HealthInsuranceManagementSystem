using CapStoneAPI.DTOs.Policy;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CapStoneAPI.Controllers;

[ApiController]
[Route("api/policies")]
public class PolicyController : ControllerBase
{
    private readonly IPolicyService _service;

    public PolicyController(IPolicyService service)
    {
        _service = service;
    }

    //  Create Policy
    [Authorize(Roles = "InsuranceAgent")] 
    [HttpPost]
    public async Task<IActionResult> CreatePolicy(CreatePolicyDto dto)
    {
        var agentId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _service.CreatePolicyAsync(dto, agentId);
        return Ok("Policy created successfully");
    }

    //  View Policies (Role-filtered)
    [Authorize(Roles = "Admin,InsuranceAgent,Customer,ClaimsOfficer")]
    [HttpGet]
    public async Task<IActionResult> GetPolicies()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        return Ok(await _service.GetPoliciesAsync(userId, role));
    }

    //  View Single Policy
    [Authorize(Roles = "Admin,InsuranceAgent,Customer,CLaimsOfficer")]
    [HttpGet("{policyId}")]
    public async Task<IActionResult> GetPolicy(int policyId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        return Ok(await _service.GetPolicyByIdAsync(policyId, userId, role));
    }

    //  Suspend Policy
    [Authorize(Roles = "InsuranceAgent")]
    [HttpPut("{policyId}/suspend")]
    public async Task<IActionResult> SuspendPolicy(int policyId)
    {
        await _service.SuspendPolicyAsync(policyId);
        return Ok("Policy suspended");
    }

    //  Renew Policy
    [Authorize(Roles = "InsuranceAgent")]
    [HttpPost("{policyId}/renew")]
    public async Task<IActionResult> RenewPolicy(
        int policyId, RenewPolicyDto dto)
    {
        await _service.RenewPolicyAsync(policyId, dto.AdditionalMonths);
        return Ok("Policy renewed");
    }
}
