namespace CapStoneAPI.Dtos
{
    public class InsurancePlanPublicResponseDto
    {
        public int PlanId { get; set; }
        public string PlanName { get; set; }
        public decimal CoverageAmount { get; set; }
        public decimal BasePremium { get; set; }
        public int DurationMonths { get; set; }
        public string Description { get; set; }
    }

}
