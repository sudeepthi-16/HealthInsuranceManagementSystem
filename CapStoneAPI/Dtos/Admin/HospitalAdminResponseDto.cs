namespace CapStoneAPI.DTOs.Admin;

public class HospitalAdminResponseDto
{
    
    public int HospitalId { get; set; }
    public string HospitalName { get; set; }
    public string City { get; set; }
    public bool IsNetworkHospital { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
