using CapStoneAPI.Dtos.Claims;
using CapStoneAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CapStoneAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentsController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpPost("upload")]
        [Authorize(Roles = "Hospital")]
        public async Task<IActionResult> UploadDocument([FromForm] DocumentUploadDto uploadDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var result = await _documentService.UploadDocumentAsync(uploadDto, userId);
                return Ok(result);
            }
            catch (ArgumentException ex) { return BadRequest(ex.Message); }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
            catch (Exception ex) { return StatusCode(500, "Internal server error: " + ex.Message); }
        }

        [HttpGet("claim/{claimId}")]
        [Authorize(Roles = "Hospital,ClaimsOfficer")]
        public async Task<ActionResult<IEnumerable<DocumentResponseDto>>> GetDocuments(int claimId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirstValue(ClaimTypes.Role);
                var documents = await _documentService.GetDocumentsForClaimAsync(claimId, userId, role);
                return Ok(documents);
            }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch (Exception ex) { return StatusCode(500, "Internal server error: " + ex.Message); }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Hospital,ClaimsOfficer")]
        public async Task<IActionResult> DownloadDocument(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirstValue(ClaimTypes.Role);
                var result = await _documentService.DownloadDocumentAsync(id, userId, role);
                return File(result.FileStream, result.ContentType, result.FileName);
            }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
            catch (FileNotFoundException ex) { return NotFound(ex.Message); }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch (Exception ex) { return StatusCode(500, "Internal server error: " + ex.Message); }
        }
    }
}
