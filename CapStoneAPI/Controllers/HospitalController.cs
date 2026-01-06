using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CapStoneAPI.Controllers;

[ApiController]
[Route("api/hospitals")]
public class HospitalController : ControllerBase
{
    private readonly IHospitalService _service;

    public HospitalController(IHospitalService service)
    {
        _service = service;
    }

    //  View hospitals
    [Authorize(Roles = "Admin,InsuranceAgent,Customer")]
    [HttpGet]
    public async Task<IActionResult> GetHospitals()
    {
        var isAdmin = User.IsInRole("Admin");
        return Ok(await _service.GetHospitalsAsync(isAdmin));
    }
    //  Create hospital
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateHospital(CreateHospitalDto dto)
    {
        await _service.CreateHospitalAsync(dto);
        return Ok("Hospital created");
    }

    //  Edit hospital
    [Authorize(Roles = "Admin")]
    [HttpPut("{hospitalId}")]
    public async Task<IActionResult> UpdateHospital(
        int hospitalId, CreateHospitalDto dto)
    {
        await _service.UpdateHospitalAsync(hospitalId, dto);
        return Ok("Hospital updated");
    }


    //  Activate / Deactivate
    [Authorize(Roles = "Admin")]
    [HttpPut("{hospitalId}/status")]
    public async Task<IActionResult> UpdateHospitalStatus(
        int hospitalId, UpdateStatusDto dto)
    {
        await _service.UpdateHospitalStatusAsync(hospitalId, dto.IsActive);
        return Ok("Hospital status updated");
    }
}
