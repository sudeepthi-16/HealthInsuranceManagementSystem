using CapStoneAPI.Data;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Repositories;

public class HospitalRepository : IHospitalRepository
{
    private readonly AppDbContext _context;

    public HospitalRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Hospital>> GetAllAsync()
        => await _context.Hospitals.ToListAsync();

    public async Task<Hospital?> GetByIdAsync(int hospitalId)
        => await _context.Hospitals.FindAsync(hospitalId);

    public async Task AddAsync(Hospital hospital)
    {
        await _context.Hospitals.AddAsync(hospital);

        //  IMPORTANT: tell EF NOT to touch ApplicationUser
        _context.Entry(hospital)
                .Reference(h => h.User)
                .IsModified = false;
    }


    public async Task<Hospital?> GetByUserIdAsync(string userId)
    {
        return await _context.Hospitals
            .FirstOrDefaultAsync(h => h.UserId == userId);
    }


    public async Task SaveAsync()
        => await _context.SaveChangesAsync();
}
