using Microsoft.AspNetCore.Identity;
namespace CapStoneAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? CustomerCode { get; set; }
        public int? HospitalId { get; set; }
        public Hospital? Hospital { get; set; }

    }
}
