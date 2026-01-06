using CapStoneAPI.Data;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Repositories;

public class PolicyRepository : IPolicyRepository
{
    private readonly AppDbContext _context;

    public PolicyRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Policy>> GetAllAsync()
        => await _context.Policies
            .Include(p => p.Plan)
            .Include(p => p.User)
            .Include(p => p.Claims)
            .ToListAsync();

    public async Task<Policy?> GetByIdAsync(int policyId)
        => await _context.Policies
            .Include(p => p.Plan)
            .Include(p => p.User)
            .Include(p => p.Claims)

            .FirstOrDefaultAsync(p => p.PolicyId == policyId);

    public async Task AddAsync(Policy policy)
        => await _context.Policies.AddAsync(policy);

    public async Task SaveAsync()
        => await _context.SaveChangesAsync();
}
