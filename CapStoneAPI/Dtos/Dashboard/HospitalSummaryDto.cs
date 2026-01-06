namespace CapStoneAPI.Dtos.Dashboard
{
    public class HospitalSummaryDto
    {
        public int TotalClaims { get; set; }
        public int Submitted { get; set; }
        public int InReview { get; set; }
        public int Approved { get; set; }
        public int Rejected { get; set; }
        public int Paid { get; set; }
    }
}
