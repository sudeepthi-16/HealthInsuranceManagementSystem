namespace CapStoneAPI.Dtos.Claims
{
    public class DocumentResponseDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public DateTime UploadDate { get; set; }
        public string UploadedBy { get; set; }
    }
}
