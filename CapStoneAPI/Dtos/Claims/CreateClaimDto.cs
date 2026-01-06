namespace CapStoneAPI.Dtos.Claims
{
    public class CreateClaimDto
    {
        public int PolicyId { get; set; }
        public decimal ClaimAmount { get; set; }
        public string CustomerDescription { get; set; }
        public int HospitalId { get; set; }
    }
}
