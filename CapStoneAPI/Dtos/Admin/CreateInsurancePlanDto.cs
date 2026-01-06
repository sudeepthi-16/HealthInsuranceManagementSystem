namespace CapStoneAPI.DTOs.Admin;

public class CreateInsurancePlanDto
{
    public string PlanName { get; set; }
    public decimal CoverageAmount { get; set; }
    public int DurationMonths { get; set; }
    public string? Description { get; set; }
}
