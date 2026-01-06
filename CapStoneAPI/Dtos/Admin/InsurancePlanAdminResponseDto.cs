namespace CapStoneAPI.DTOs.Admin;

public class InsurancePlanAdminResponseDto
{
   
    public int PlanId { get; set; }
    public string PlanName { get; set; }
    public decimal CoverageAmount { get; set; }
    public decimal BasePremium { get; set; }
    public int DurationMonths { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Description { get; set; }
}
