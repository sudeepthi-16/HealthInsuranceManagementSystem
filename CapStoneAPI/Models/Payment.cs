using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace CapStoneAPI.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        public int? PolicyId { get; set; }
        public int? ClaimId { get; set; }

        public decimal Amount { get; set; }
        public string PaymentType { get; set; }   // Premium / Claim
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        public string Status { get; set; }

        public Policy Policy { get; set; }
        public ClaimsTable Claim { get; set; }
    }
}
