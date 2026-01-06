using CapStoneAPI.Dtos.Claims;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using System.Security.Claims;

namespace CapStoneAPI.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IWebHostEnvironment _environment;

        public DocumentService(IDocumentRepository documentRepository, IUserRepository userRepository, IWebHostEnvironment environment)
        {
            _documentRepository = documentRepository;
            _userRepository = userRepository;
            _environment = environment;
        }

        public async Task<DocumentResponseDto> UploadDocumentAsync(DocumentUploadDto uploadDto, string userId)
        {
            if (uploadDto.File == null || uploadDto.File.Length == 0)
                throw new ArgumentException("No file uploaded.");

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.HospitalId == null)
                throw new UnauthorizedAccessException("User is not associated with a hospital.");

            var claim = await _documentRepository.GetClaimByIdAsync(uploadDto.ClaimId);
            if (claim == null)
                throw new KeyNotFoundException("Claim not found.");

            if (claim.HospitalId != user.HospitalId)
                throw new UnauthorizedAccessException("You can only upload documents for claims in your hospital.");

            // Create Uploads directory if not exists
            var uploadsFolder = Path.Combine(_environment.ContentRootPath, "Uploads", "Documents");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + uploadDto.File.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await uploadDto.File.CopyToAsync(stream);
            }

            var document = new ClaimDocument
            {
                ClaimsTableId = uploadDto.ClaimId,
                FileName = uploadDto.File.FileName,
                FilePath = uniqueFileName,
                UploadedBy = user.UserName, // or FullName
                UploadDate = DateTime.Now
            };

            await _documentRepository.AddDocumentAsync(document);

            return new DocumentResponseDto
            {
                Id = document.Id,
                FileName = document.FileName,
                UploadDate = document.UploadDate,
                UploadedBy = document.UploadedBy
            };
        }

        public async Task<IEnumerable<DocumentResponseDto>> GetDocumentsForClaimAsync(int claimId, string userId, string userRole)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            var claim = await _documentRepository.GetClaimByIdAsync(claimId);

            if (claim == null) throw new KeyNotFoundException("Claim not found");

            // Security Check
            if (userRole == "Hospital")
            {
                if (user.HospitalId != claim.HospitalId)
                    throw new UnauthorizedAccessException("Access denied to this claim's documents.");
            }

            var documents = await _documentRepository.GetDocumentsByClaimIdAsync(claimId);

            return documents.Select(d => new DocumentResponseDto
            {
                Id = d.Id,
                FileName = d.FileName,
                UploadDate = d.UploadDate,
                UploadedBy = d.UploadedBy
            });
        }

        public async Task<DocumentDownloadResult> DownloadDocumentAsync(int documentId, string userId, string userRole)
        {
            var document = await _documentRepository.GetDocumentByIdAsync(documentId);
            if (document == null) throw new KeyNotFoundException("Document not found.");

            var user = await _userRepository.GetByIdAsync(userId);

            // Security Check
            if (userRole == "Hospital")
            {
                if (user.HospitalId != document.Claim.HospitalId)
                    throw new UnauthorizedAccessException("Access denied.");
            }

            var uploadsFolder = Path.Combine(_environment.ContentRootPath, "Uploads", "Documents");
            var filePath = Path.Combine(uploadsFolder, document.FilePath);

            if (!File.Exists(filePath))
                throw new FileNotFoundException("File not found on server.");

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return new DocumentDownloadResult
            {
                FileStream = memory,
                ContentType = GetContentType(filePath),
                FileName = document.FileName
            };
        }

        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types.ContainsKey(ext) ? types[ext] : "application/octet-stream";
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
}
