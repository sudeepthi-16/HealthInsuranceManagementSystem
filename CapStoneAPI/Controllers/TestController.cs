// this controller is only for testing authrization of roles RBAC


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CapStoneAPI.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public IActionResult AdminOnly()
        => Ok("Welcome Admin");

    [Authorize(Roles = "InsuranceAgent")]
    [HttpGet("agent")]
    public IActionResult AgentOnly()
        => Ok("Welcome Insurance Agent");

    [Authorize(Roles = "ClaimsOfficer")]
    [HttpGet("claims-officer")]
    public IActionResult ClaimsOfficerOnly()
        => Ok("Welcome Claims Officer");

    [Authorize(Roles = "Hospital")]
    [HttpGet("hospital")]
    public IActionResult HospitalOnly()
        => Ok("Welcome Hospital");

    [Authorize(Roles = "Customer")]
    [HttpGet("customer")]
    public IActionResult CustomerOnly()
        => Ok("Welcome Customer");
}
