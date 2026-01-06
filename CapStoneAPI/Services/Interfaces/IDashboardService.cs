using CapStoneAPI.Dtos.Dashboard;
namespace CapStoneAPI.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
        Task<HospitalSummaryDto> GetHospitalSummaryAsync(string userId);
        Task<List<ClaimsByOfficerDto>> GetClaimsByOfficerAsync();
        Task<List<CountByStatusDto>> GetPoliciesByStatusAsync();
        Task<List<CountByStatusDto>> GetClaimsByStatusAsync();
        Task<List<ClaimsByHospitalDto>> GetClaimsByHospitalAsync();
       
        Task<List<HighValueClaimDto>> GetHighValueClaimsAsync();
    }

}
