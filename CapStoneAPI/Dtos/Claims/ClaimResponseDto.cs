namespace CapStoneAPI.Dtos.Claims
{
    public class ClaimResponseDto
    {
        public int ClaimId { get; set; }
        public int PolicyId { get; set; }
        public int HospitalId { get; set; }
        public string HospitalName { get; set; }

        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }

        public decimal ClaimAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public string? CustomerDescription { get; set; }
        public string? OfficerRemarks { get; set; }
        public string? HospitalNotes { get; set; }

        public string Status { get; set; }

        public DateTime SubmittedDate { get; set; }
    }
}
