namespace CapStoneAPI.Dtos.Dashboard
{
    public class OfficerSummaryDto
    {
        public int TotalClaims { get; set; }
        public int ClaimsInReview { get; set; }
        public int Approved {  get; set; }
        public int Rejected { get; set; }
    }
}
