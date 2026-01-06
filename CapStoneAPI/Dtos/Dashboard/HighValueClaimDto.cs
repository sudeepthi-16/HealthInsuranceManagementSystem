namespace CapStoneAPI.Dtos.Dashboard
{
    public class HighValueClaimDto
    {
        public int PolicyId { get; set; }
        public string CustomerName { get; set; }
        public decimal TotalAmountUsed { get; set; }
        public decimal CoverageAmount { get; set; }
    }
}
