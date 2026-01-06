namespace CapStoneAPI.DTOs.Policy;

public class CreatePolicyDto
{
    // Selected by Insurance Agent
    public string CustomerId { get; set; }   // AspNetUsers.Id
    public int PlanId { get; set; }           // InsurancePlan.PlanId


}
