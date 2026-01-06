using System.ComponentModel.DataAnnotations;

namespace CapStoneAPI.Models
{
    public class Hospital
    {
        [Key]
        public int HospitalId { get; set; }
        public string? UserId { get; set; }  // FK to AspNetUsers.Id
        public string HospitalName { get; set; }
        public string City { get; set; }
        public bool IsNetworkHospital { get; set; } = true;
        public bool IsActive { get; set; } = true;
        public ApplicationUser? User { get; set; }
    }
}
