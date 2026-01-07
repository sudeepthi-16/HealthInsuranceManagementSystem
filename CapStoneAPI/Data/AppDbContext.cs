using CapStoneAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
namespace CapStoneAPI.Data
{
    public class AppDbContext
    : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<InsurancePlan> InsurancePlans { get; set; }
        public DbSet<Models.Notification> Notifications { get; set; }
        public DbSet<Policy> Policies { get; set; }
        public DbSet<Hospital> Hospitals { get; set; }
        public DbSet<ClaimsTable> Claims { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<ClaimDocument> ClaimDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Policy → User (Policy Holder)
            modelBuilder.Entity<Policy>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Policy → Created By (Agent/Admin)
            modelBuilder.Entity<Policy>()
                .HasOne(p => p.CreatedByUser)
                .WithMany()
                .HasForeignKey(p => p.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Policy → Insurance Plan
            modelBuilder.Entity<Policy>()
                .HasOne(p => p.Plan)
                .WithMany()
                .HasForeignKey(p => p.PlanId);

            // Claim → Policy
            modelBuilder.Entity<ClaimsTable>()
                .HasOne(c => c.Policy)
                .WithMany(p => p.Claims)
                .HasForeignKey(c => c.PolicyId);

            // Claim → Hospital
            modelBuilder.Entity<ClaimsTable>()
                .HasOne(c => c.Hospital)
                .WithMany()
                .HasForeignKey(c => c.HospitalId);

            // Claim → Claims Officer
            modelBuilder.Entity<ClaimsTable>()
                .HasOne(c => c.ReviewedByUser)
                .WithMany()
                .HasForeignKey(c => c.ReviewedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Payment → Policy
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Policy)
                .WithMany()
                .HasForeignKey(p => p.PolicyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Payment → Claim
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Claim)
                .WithMany()
                .HasForeignKey(p => p.ClaimId)
                .OnDelete(DeleteBehavior.Restrict);

            //hospital Manager -> Hospital
            modelBuilder.Entity<ApplicationUser>()
        .HasOne(u => u.Hospital)
        .WithMany()
        .HasForeignKey(u => u.HospitalId)
        .OnDelete(DeleteBehavior.Restrict);


            //Hospital -> User
            modelBuilder.Entity<Hospital>()
                .HasOne(h => h.User)
                .WithMany()                    //  important to allow creation of user n hospital at once -> changed
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Unique index on CustomerCode in ApplicationUser
            modelBuilder.Entity<ApplicationUser>()
    .HasIndex(u => u.CustomerCode)
    .IsUnique()
    .HasFilter("[CustomerCode] IS NOT NULL");
            modelBuilder.Entity<ClaimDocument>()
    .HasOne(cd => cd.Claim)
    .WithMany(c => c.Documents)
    .HasForeignKey(cd => cd.ClaimsTableId)
    .OnDelete(DeleteBehavior.Cascade);



        }
    }

}
