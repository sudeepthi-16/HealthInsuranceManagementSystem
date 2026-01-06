using CapStoneAPI.DTOs.Policy;

namespace CapStoneAPI.Services.Interfaces;

public interface IPolicyService
{
    Task CreatePolicyAsync(CreatePolicyDto dto, string agentId);

    Task<List<PolicyResponseDto>> GetPoliciesAsync(string userId, string role);

    Task<PolicyResponseDto> GetPolicyByIdAsync(
        int policyId, string userId, string role);

    Task SuspendPolicyAsync(int policyId);

    Task RenewPolicyAsync(int policyId, int additionalMonths);
}
