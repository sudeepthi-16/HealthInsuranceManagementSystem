using System.ComponentModel.DataAnnotations;

public class CreateHospitalManagerDto
{
    [Required]
    public int HospitalId { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
    public string FullName { get; set; }
}
