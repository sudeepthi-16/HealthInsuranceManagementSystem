namespace CapStoneAPI.DTOs.Admin;

public class CreateHospitalDto
{
    public string HospitalName { get; set; }
    public string City { get; set; }
    public bool IsNetworkHospital { get; set; } = true;
}
