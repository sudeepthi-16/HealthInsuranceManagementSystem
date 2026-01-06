using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Models;

namespace CapStoneAPI.Services.Interfaces
{
    public interface IHospitalManagerUserService
    {
        Task CreateHospitalManagerAsync(CreateHospitalManagerDto dto);



    }
}
