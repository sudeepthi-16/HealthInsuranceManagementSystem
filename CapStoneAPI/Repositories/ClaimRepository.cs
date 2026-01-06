using CapStoneAPI.Data;
using CapStoneAPI.Repositories.Interfaces;
using System.Security.Claims;
using CapStoneAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Repositories
{
    public class ClaimRepository : IClaimRepository
    {
        private readonly AppDbContext _context;

        public ClaimRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ClaimsTable>> GetAllAsync()
        {
            return await _context.Claims
                .Include(c => c.Policy)
                    .ThenInclude(p => p.User)
                .Include(c => c.Policy)
                    .ThenInclude(p => p.Plan)
                .Include(c => c.Hospital)
                .ToListAsync();
        }



        public async Task<ClaimsTable?> GetByIdAsync(int claimId)
            => await _context.Claims
                .Include(c => c.Policy)
                .Include(c => c.Hospital)
                .FirstOrDefaultAsync(c => c.ClaimsTableId == claimId);

        public async Task AddAsync(ClaimsTable claim)
            => await _context.Claims.AddAsync(claim);

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
