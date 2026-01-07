using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace CapStoneAPI.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repo;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IHospitalRepository _hospitalRepo;

    public UserService(
        IUserRepository repo,
        UserManager<ApplicationUser> userManager,IHospitalRepository hospitalRepository)
    {
        _repo = repo;
        _userManager = userManager;
        _hospitalRepo = hospitalRepository;
    }

    //  View all users (Admin)
    public async Task<List<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _repo.GetAllUsersAsync();

        var response = new List<UserResponseDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            response.Add(new UserResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                CustomerCode = user.CustomerCode,
                Email = user.Email,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                Role = roles.FirstOrDefault()   // usually one role
            });
        }

        return response;
    }

    // Create non-customer users (Admin)
    public async Task CreateUserAsync(CreateUserDto dto)
    {
        if (dto.Role == "Customer")
            throw new ApplicationException("Customers must self-register");
        if (dto.Role == "Hospital")
            throw new ApplicationException("Wrong API");

        var user = new ApplicationUser
        {
            FullName = dto.FullName,
            Email = dto.Email,
            UserName = dto.Email,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            throw new ApplicationException(
                string.Join(", ", result.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(user, dto.Role);
    }

    // Activate / Deactivate user
    public async Task UpdateUserStatusAsync(string targetUserId,bool isActive,string currentAdminUserId)
    {
        //  Admin cannot disable himself
        if (targetUserId == currentAdminUserId && isActive == false)
            throw new ApplicationException("Admin cannot disable their own account");

        var user = await _repo.GetByIdAsync(targetUserId)
            ?? throw new ApplicationException("User not found");

        user.IsActive = isActive;
        await _repo.SaveAsync();
    }
    public async Task CreateHospitalManagerAsync(CreateHospitalManagerDto dto)
    {
        //  Validate hospital
        var hospital = await _hospitalRepo.GetByIdAsync(dto.HospitalId)
            ?? throw new ApplicationException("Hospital not found");

        if (!hospital.IsActive)
            throw new ApplicationException("Hospital is inactive");

        //  Create user
        var user = new ApplicationUser
        {
            Email = dto.Email,
            UserName = dto.Email,
            FullName = dto.FullName,
            IsActive = true,
            HospitalId = dto.HospitalId   
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            throw new ApplicationException(
                string.Join(", ", result.Errors.Select(e => e.Description)));

        //  Assign Hospital role
        await _userManager.AddToRoleAsync(user, "Hospital");
    }

}
