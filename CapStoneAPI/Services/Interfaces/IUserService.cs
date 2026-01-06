using CapStoneAPI.DTOs.Admin;

namespace CapStoneAPI.Services.Interfaces;

public interface IUserService
{
    Task<List<UserResponseDto>> GetAllUsersAsync();
    Task CreateUserAsync(CreateUserDto dto);
    Task UpdateUserStatusAsync(string userId, bool isActive, string currentAdminUserId);
    Task CreateHospitalManagerAsync(CreateHospitalManagerDto dto);


}
