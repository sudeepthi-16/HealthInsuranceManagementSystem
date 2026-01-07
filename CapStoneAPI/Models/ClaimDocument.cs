using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CapStoneAPI.Models
{
    public class ClaimDocument
    {
        [Key]
        public int Id { get; set; }
        public int ClaimsTableId { get; set; }
        [Required]
        public string FileName { get; set; }
        [Required]
        public string FilePath { get; set; } // Server path
        public string UploadedBy { get; set; } 
        public DateTime UploadDate { get; set; } = DateTime.Now;

        [ForeignKey("ClaimsTableId")]
        public ClaimsTable Claim { get; set; }
    }
}
