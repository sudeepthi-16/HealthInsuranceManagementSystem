using CapStoneAPI.Data;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ApplicationUser>> GetAllUsersAsync()
        => await _context.Users.ToListAsync();

    public async Task<ApplicationUser?> GetByIdAsync(string userId)
        => await _context.Users.FindAsync(userId);

    public async Task SaveAsync()
        => await _context.SaveChangesAsync();
}
