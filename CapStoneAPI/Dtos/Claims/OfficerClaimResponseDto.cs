namespace CapStoneAPI.Dtos.Claims
{
    public class OfficerClaimResponseDto
    {
        public int ClaimId { get; set; }

        // Claim
        public decimal ClaimAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public string Status { get; set; }
        public DateTime SubmittedDate { get; set; }

        // Customer
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }

        // Hospital
        public int HospitalId { get; set; }
        public string HospitalName { get; set; }
        public string? HospitalNotes { get; set; }

        // Policy
        public int PolicyId { get; set; }
        public string PolicyNumber { get; set; }
        public decimal CoverageAmount { get; set; }
        public string PolicyStatus { get; set; }
        public DateTime PolicyStartDate { get; set; }
        public DateTime PolicyEndDate { get; set; }

        // Plan
        public int PlanId { get; set; }
        public string PlanName { get; set; }

        // Coverage Tracking
        public decimal UsedCoverageAmount { get; set; }
        public decimal RemainingCoverageAmount { get; set; }

        // Notes
        public string? CustomerDescription { get; set; }
        public string? OfficerRemarks { get; set; }
        public string PremiumStatus { get; set; }
    }
}
