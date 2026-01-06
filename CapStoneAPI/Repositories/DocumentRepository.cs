using CapStoneAPI.Data;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly AppDbContext _context;

        public DocumentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddDocumentAsync(ClaimDocument document)
        {
            _context.ClaimDocuments.Add(document);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ClaimDocument>> GetDocumentsByClaimIdAsync(int claimId)
        {
            return await _context.ClaimDocuments
                .Where(d => d.ClaimsTableId == claimId)
                .ToListAsync();
        }

        public async Task<ClaimDocument> GetDocumentByIdAsync(int id)
        {
            return await _context.ClaimDocuments
                .Include(d => d.Claim)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<ClaimsTable> GetClaimByIdAsync(int claimId)
        {
             return await _context.Claims.FindAsync(claimId);
        }
    }
}
