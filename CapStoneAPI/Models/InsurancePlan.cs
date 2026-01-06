using System.ComponentModel.DataAnnotations;

namespace CapStoneAPI.Models
{
    public class InsurancePlan
    {
        [Key]
        public int InsurancePlanId { get; set; }
        public string PlanName { get; set; }
        public decimal CoverageAmount { get; set; }
        public decimal BasePremium { get; set; }
        public int DurationMonths { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
