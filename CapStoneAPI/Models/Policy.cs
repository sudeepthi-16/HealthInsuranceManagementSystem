using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.ComponentModel.DataAnnotations;

namespace CapStoneAPI.Models
{
    public class Policy
    {
        [Key]
        public int PolicyId { get; set; }
        public string PolicyNumber { get; set; }

        public string UserId { get; set; }              // Policy holder
        public int PlanId { get; set; }


        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } // Active / suspended /expired

        public decimal TotalPremium { get; set; }
        public string PremiumStatus { get; set; } //paid/due
        public DateTime? NextDueDate { get; set; }

        public string CreatedByUserId { get; set; }     // AgentId
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ApplicationUser User { get; set; }
        public ApplicationUser CreatedByUser { get; set; }
        public InsurancePlan Plan { get; set; }
        
        public ICollection<ClaimsTable> Claims { get; set; } 

    }
}
