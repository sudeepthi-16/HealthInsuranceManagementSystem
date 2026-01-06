using CapStoneAPI.DTOs.Admin;

namespace CapStoneAPI.Services.Interfaces;

public interface IHospitalService
{
    Task<IEnumerable<object>> GetHospitalsAsync(bool isAdmin);
    Task CreateHospitalAsync(CreateHospitalDto dto);
    Task UpdateHospitalAsync(int hospitalId, CreateHospitalDto dto);
    Task UpdateHospitalStatusAsync(int hospitalId, bool isActive);
}
