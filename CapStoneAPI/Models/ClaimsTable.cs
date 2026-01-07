using System.ComponentModel.DataAnnotations;

namespace CapStoneAPI.Models
{
    public class ClaimsTable
    {
        [Key]
        public int ClaimsTableId { get; set; }
        public int PolicyId { get; set; }
        public int HospitalId { get; set; }

        public decimal ClaimAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public  string Status { get; set; } //created/submitted/inreview/accepted/rejected

        public string? CustomerDescription { get; set; }
        public string? HospitalNotes { get; set; }
        public string? OfficerRemarks { get; set; }

        public DateTime SubmittedDate { get; set; } = DateTime.Now;
        public string? ReviewedByUserId { get; set; }

        public Policy Policy { get; set; }
        public Hospital Hospital { get; set; }
        public ApplicationUser ReviewedByUser { get; set; }
        public ICollection<ClaimDocument> Documents { get; set; }
    }
}
