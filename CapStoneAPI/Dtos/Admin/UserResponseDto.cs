namespace CapStoneAPI.DTOs.Admin;

public class UserResponseDto
{
    public string UserId { get; set; }
    public string CustomerCode { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public string Email { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
