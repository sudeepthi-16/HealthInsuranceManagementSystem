using CapStoneAPI.Data;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Repositories;

public class InsurancePlanRepository : IInsurancePlanRepository
{
    private readonly AppDbContext _context;

    public InsurancePlanRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<InsurancePlan>> GetAllAsync()
        => await _context.InsurancePlans.ToListAsync();

    public async Task<InsurancePlan?> GetByIdAsync(int planId)
        => await _context.InsurancePlans.FindAsync(planId);

    public async Task AddAsync(InsurancePlan plan)
        => await _context.InsurancePlans.AddAsync(plan);

    public async Task SaveAsync()
        => await _context.SaveChangesAsync();
}
