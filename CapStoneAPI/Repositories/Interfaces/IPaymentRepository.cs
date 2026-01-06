using CapStoneAPI.Models;

namespace CapStoneAPI.Repositories.Interfaces
{
    public interface IPaymentRepository
    {
        Task<List<Payment>> GetAllAsync();
        Task<List<Payment>> GetByPolicyIdAsync(int policyId);
        Task AddAsync(Payment payment);
        Task SaveAsync();
    }
}
