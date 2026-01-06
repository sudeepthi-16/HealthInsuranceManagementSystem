using CapStoneAPI.Dtos.Claims;

namespace CapStoneAPI.Services.Interfaces
{
    public class DocumentDownloadResult
    {
        public Stream FileStream { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }

    public interface IDocumentService
    {
        Task<DocumentResponseDto> UploadDocumentAsync(DocumentUploadDto uploadDto, string userId);
        Task<IEnumerable<DocumentResponseDto>> GetDocumentsForClaimAsync(int claimId, string userId, string userRole);
        Task<DocumentDownloadResult> DownloadDocumentAsync(int documentId, string userId, string userRole);
    }
}
