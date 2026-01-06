using CapStoneAPI.Data;
using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Services
{
    public class AdminService : IHospitalManagerUserService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHospitalRepository _hospitalRepo;

        public AdminService(
            AppDbContext context,
            UserManager<ApplicationUser> userManager,
            IHospitalRepository hospitalRepo)
        {
            _context = context;
            _userManager = userManager;
            _hospitalRepo = hospitalRepo;
        }


        public async Task CreateHospitalManagerAsync(CreateHospitalManagerDto dto)
        {
            var hospital = await _hospitalRepo.GetByIdAsync(dto.HospitalId)
                ?? throw new ApplicationException("Hospital not found");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                HospitalId = dto.HospitalId,
                IsActive = true,
                FullName = dto.FullName
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                throw new ApplicationException("Failed to create hospital manager");

            await _userManager.AddToRoleAsync(user, "Hospital");
        }


    }
}
