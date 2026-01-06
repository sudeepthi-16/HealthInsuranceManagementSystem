using CapStoneAPI.Dtos.Payment;
using CapStoneAPI.Models;

namespace CapStoneAPI.Services.Interfaces
{
    public interface IPaymentService
    {
        Task MakePremiumPaymentAsync(MakePremiumPaymentDto dto, string customerId);
        Task<List<PaymentResponseDto>> GetPaymentsAsync(string userId, string role);
        Task RecordClaimPayoutAsync(ClaimsTable claim);
    }

}
