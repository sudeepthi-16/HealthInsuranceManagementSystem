using Microsoft.AspNetCore.Http;

namespace CapStoneAPI.Dtos.Claims
{
    public class DocumentUploadDto
    {
        public IFormFile File { get; set; }
        public int ClaimId { get; set; }
    }
}
