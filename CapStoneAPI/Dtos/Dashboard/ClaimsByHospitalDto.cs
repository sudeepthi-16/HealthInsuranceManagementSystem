namespace CapStoneAPI.Dtos.Dashboard
{
    public class ClaimsByHospitalDto
    {
        public string HospitalName { get; set; }
        public int ClaimCount { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
