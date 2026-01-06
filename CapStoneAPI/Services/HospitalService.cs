using CapStoneAPI.Dtos;
using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;

namespace CapStoneAPI.Services;

public class HospitalService : IHospitalService
{
    private readonly IHospitalRepository _repo;

    public HospitalService(IHospitalRepository repo)
    {
        _repo = repo;
    }

    //  View hospitals
    public async Task<IEnumerable<object>> GetHospitalsAsync(bool isAdmin)
    {
        var hospitals = await _repo.GetAllAsync();

        if (isAdmin)
        {
            return hospitals
                .OrderBy(h => h.HospitalName)
                .Select((h, i) => new HospitalAdminResponseDto
                {
                    
                    HospitalId = h.HospitalId,
                    HospitalName = h.HospitalName,
                    City = h.City,
                    IsNetworkHospital = h.IsNetworkHospital,
                    IsActive = h.IsActive
                })
                .ToList();
        }

        return hospitals
            .Where(h => h.IsActive)
            .OrderBy(h => h.HospitalName)
            .Select((h, i) => new HospitalPublicResponseDto
            {
                
                HospitalId = h.HospitalId,
                HospitalName = h.HospitalName,
                City = h.City,
                IsNetworkHospital = h.IsNetworkHospital
            })
            .ToList();
    }

    //  Create hospital
    public async Task CreateHospitalAsync(CreateHospitalDto dto)
    {
        var hospital = new Hospital
        {
            HospitalName = dto.HospitalName,
            City = dto.City,
            IsNetworkHospital = dto.IsNetworkHospital,
            IsActive = true
        };

        await _repo.AddAsync(hospital);
        await _repo.SaveAsync();
    }

    //  Edit hospital
    public async Task UpdateHospitalAsync(int hospitalId, CreateHospitalDto dto)
    {
        var hospital = await _repo.GetByIdAsync(hospitalId)
            ?? throw new ApplicationException("Hospital not found");

        hospital.HospitalName = dto.HospitalName;
        hospital.City = dto.City;
        hospital.IsNetworkHospital = dto.IsNetworkHospital;

        await _repo.SaveAsync();
    }



    //  Activate / Deactivate
    public async Task UpdateHospitalStatusAsync(int hospitalId, bool isActive)
    {
        var hospital = await _repo.GetByIdAsync(hospitalId)
            ?? throw new ApplicationException("Hospital not found");

        hospital.IsActive = isActive;
        await _repo.SaveAsync();
    }
}
