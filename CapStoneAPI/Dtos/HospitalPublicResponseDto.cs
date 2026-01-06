namespace CapStoneAPI.Dtos
{
    public class HospitalPublicResponseDto
    {
        public int HospitalId { get; set; }
        public string HospitalName { get; set; }
        public string City { get; set; }
        public bool IsNetworkHospital { get; set; }
    }
}
