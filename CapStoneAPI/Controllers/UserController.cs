using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Services;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CapStoneAPI.Controllers;


[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    //  View all users
    [Authorize(Roles = "Admin,InsuranceAgent")]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
        => Ok(await _service.GetAllUsersAsync());

    //  Create Agent / Officer / Hospital
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserDto dto)
    {
        await _service.CreateUserAsync(dto);
        return Ok(new { message = "User created successfully" });
    }

    //  Activate / Deactivate
    [Authorize(Roles = "Admin")]
    [HttpPut("{userId}/status")]
    public async Task<IActionResult> UpdateUserStatus(
    string userId,
    UpdateStatusDto dto)
    {
        var currentAdminUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        await _service.UpdateUserStatusAsync(
            userId,
            dto.IsActive,
            currentAdminUserId);

        return Ok(new { message = "User status updated" });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("hospital-managers")]
    public async Task<IActionResult> CreateHospitalManager(
    CreateHospitalManagerDto dto)
    {
        await _service.CreateHospitalManagerAsync(dto);
        return Ok(new { message = "Hospital manager created successfully" });
    }

}
