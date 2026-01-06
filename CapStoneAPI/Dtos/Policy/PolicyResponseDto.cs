namespace CapStoneAPI.DTOs.Policy;

public class PolicyResponseDto
{
    public int PolicyId { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string CustomerCode { get; set; }

    public string Status { get; set; }          // Active / Expired / Suspended
    public string PremiumStatus { get; set; }   // Due / Paid

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? NextDueDate { get; set; }

    public decimal TotalPremium { get; set; }

    //UI clarity
    public int PlanId { get; set; }
    public string PlanName { get; set; }
    public decimal CoverageAmount { get; set; }
    public decimal ClaimsUsedAmount { get; set; }
}
