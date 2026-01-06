using CapStoneAPI.Data;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AppDbContext _context;

        public PaymentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Payment>> GetAllAsync()
        {
            return await _context.Payments
                .Include(p => p.Policy)
                    .ThenInclude(pol => pol.User)
                .Include(p => p.Claim)
                    .ThenInclude(c => c.Hospital)
                .ToListAsync();
        }

        public async Task<List<Payment>> GetByPolicyIdAsync(int policyId)
            => await _context.Payments
                .Where(p => p.PolicyId == policyId)
                .ToListAsync();

        public async Task AddAsync(Payment payment)
            => await _context.Payments.AddAsync(payment);

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }

}
