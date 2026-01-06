using CapStoneAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CapStoneAPI.Data;

public class DataSeeder
{
    private readonly IServiceProvider _serviceProvider;

    public DataSeeder(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task SeedRolesAndAdminAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // 1. Seed Roles
        string[] roles = { "Admin", "InsuranceAgent", "ClaimsOfficer", "Hospital", "Customer" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        // 2. Seed Admin
        var admin = await CreateUserAsync(userManager, "admin@t.com", "Admin@123", "System Admin", "Admin");

        // 3. Seed Plan (Required for Policy)
        var plan = await context.InsurancePlans.FirstOrDefaultAsync(p => p.PlanName == "Gold Health");
        if (plan == null)
        {
            plan = new InsurancePlan { PlanName = "Gold Health", CoverageAmount = 500000, BasePremium = 5000, DurationMonths = 12, Description = "Comprehensive cover" };
            context.InsurancePlans.Add(plan);
            await context.SaveChangesAsync();
        }

        // 4. Seed Customer
        var customer = await CreateUserAsync(userManager, "cust1@chk.com", "Pass@123", "Rahul Dravid", "Customer", "C005");

        // 5. Seed Policy ending 2 days ago
        if (!await context.Policies.AnyAsync(p => p.UserId == customer.Id))
        {
            var policy = new Policy
            {
                PolicyNumber = "POL-EXP-001",
                UserId = customer.Id,
                PlanId = plan.InsurancePlanId,
                Status = "Active",
                StartDate = DateTime.Today.AddMonths(-12).AddDays(-2),
                EndDate = DateTime.Today.AddDays(-2), // Ends 2 days ago
                TotalPremium = plan.BasePremium,
                PremiumStatus = "Paid",
                CreatedByUserId = admin.Id 
            };
            context.Policies.Add(policy);
            await context.SaveChangesAsync();
        }
    }

    private async Task<ApplicationUser> CreateUserAsync(UserManager<ApplicationUser> um, string email, string password, string name, string role, string? code = null)
    {
        var user = await um.FindByEmailAsync(email);
        if (user == null)
        {
            user = new ApplicationUser { UserName = email, Email = email, FullName = name, IsActive = true, CustomerCode = code };
            await um.CreateAsync(user, password);
            await um.AddToRoleAsync(user, role);
        }
        else if (code != null && user.CustomerCode == null)
        {
            // Backfill missing code
            user.CustomerCode = code;
            await um.UpdateAsync(user);
        }
        return user;
    }
}
