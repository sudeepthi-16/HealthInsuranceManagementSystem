namespace CapStoneAPI.Dtos.Dashboard
{
    public class AgentSummaryDto
    {
        public int TotalPolicies { get; set; }
        public int ActivePolicies { get; set; }
        public int ExpiredPolicies { get; set; }
        public int SuspendedPolicies { get; set; }
        public decimal PremiumDue { get; set; }
        public decimal PremiumPaid { get; set; }
    }
}
