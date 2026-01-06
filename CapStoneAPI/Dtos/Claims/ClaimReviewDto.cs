namespace CapStoneAPI.Dtos.Claims
{
    public class ClaimReviewDto
    {
        public bool IsApproved { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public string OfficerRemarks { get; set; }
    }
}
