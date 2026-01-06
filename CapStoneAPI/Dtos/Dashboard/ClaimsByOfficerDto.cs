namespace CapStoneAPI.Dtos.Dashboard
{
    public class ClaimsByOfficerDto
    {
        public string OfficerName { get; set; }
        public int Approved { get; set; }
        public int Rejected { get; set; }
    }
}
