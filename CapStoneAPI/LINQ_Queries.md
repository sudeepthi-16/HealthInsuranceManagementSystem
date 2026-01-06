# LINQ Queries Report - CapStoneAPI

This document contains a list of LINQ queries found in the Service and Repository layers of the CapStoneAPI project.

## Services

### 1. ClaimService.cs

**Method: `CreateClaimAsync`**
```csharp
// Calculating remaining coverage
var approvedClaims = policy.Claims?
    .Where(c => c.Status == "Approved" || c.Status == "Paid")
    .Sum(c => c.ApprovedAmount ?? 0) ?? 0;
```

**Method: `GetClaimsAsync` (Role: ClaimsOfficer)**
```csharp
// Transforming claims for Officer view with calculated coverage
return claims.Select(c =>
{
    var usedCoverage = c.Policy.Claims?
        .Where(claim => claim.Status == "Approved" || claim.Status == "Paid")
        .Sum(claim => claim.ApprovedAmount ?? 0) ?? 0;

    return new OfficerClaimResponseDto
    {
        // ... (mapping properties)
        UsedCoverageAmount = usedCoverage,
        RemainingCoverageAmount = c.Policy.Plan.CoverageAmount - usedCoverage,
        // ...
    };
}).Cast<object>().ToList();
```

**Method: `GetClaimsAsync` (Role: Customer)**
```csharp
// Filtering by User ID and mapping
return claims.Where(c => c.Policy.UserId == userId)
    .Select(c => new ClaimResponseDto
    {
        // ... (mapping properties)
    }).Cast<object>().ToList();
```

**Method: `GetClaimsAsync` (Role: Hospital)**
```csharp
// Filtering by Hospital ID and mapping
return claims.Where(c =>
    currentUser.HospitalId != null &&
    c.HospitalId == currentUser.HospitalId)
    .Select(c => new ClaimResponseDto
    {
        // ... (mapping properties)
    }).Cast<object>().ToList();
```

### 2. DashboardService.cs

**Method: `GetDashboardSummaryAsync`**
```csharp
// Summing Premium amounts
var premiumTotal = await _context.Payments
    .Where(p => p.PaymentType == "Premium")
    .SumAsync(p => p.Amount);

// Summing Claim amounts
var claimTotal = await _context.Payments
    .Where(p => p.PaymentType == "Claim")
    .SumAsync(p => p.Amount);
```

**Method: `GetHospitalSummaryAsync`**
```csharp
// In-memory filtering and counting (Note: GetAllAsync loads all claims first)
var myClaims = claims.Where(c => c.HospitalId == user.HospitalId).ToList();

return new HospitalSummaryDto
{
    TotalClaims = myClaims.Count,
    Submitted = myClaims.Count(c => c.Status == "Submitted"),
    InReview = myClaims.Count(c => c.Status == "InReview"),
    Approved = myClaims.Count(c => c.Status == "Approved"),
    Rejected = myClaims.Count(c => c.Status == "Rejected"),
    Paid = myClaims.Count(c => c.Status == "Paid")
};
```

**Method: `GetClaimsByOfficerAsync`**
```csharp
// Grouping claims by Reviewer
return await _context.Claims
    .Where(c => c.ReviewedByUserId != null)
    .GroupBy(c => c.ReviewedByUser.FullName)
    .Select(g => new ClaimsByOfficerDto
    {
        OfficerName = g.Key,
        Approved = g.Count(c => c.Status == "Approved" || c.Status == "Paid"),
        Rejected = g.Count(c => c.Status == "Rejected")
    })
    .ToListAsync();
```

**Method: `GetPoliciesByStatusAsync`**
```csharp
// Grouping policies by Status
return await _context.Policies
    .GroupBy(p => p.Status)
    .Select(g => new CountByStatusDto
    {
        Status = g.Key,
        Count = g.Count()
    })
    .ToListAsync();
```

**Method: `GetClaimsByStatusAsync`**
```csharp
// Grouping claims by Status
return await _context.Claims
    .GroupBy(c => c.Status)
    .Select(g => new CountByStatusDto
    {
        Status = g.Key,
        Count = g.Count()
    })
    .ToListAsync();
```

**Method: `GetClaimsByHospitalAsync`**
```csharp
// Grouping claims by Hospital Name and summing amounts
return await _context.Claims
    .GroupBy(c => c.Hospital.HospitalName)
    .Select(g => new ClaimsByHospitalDto
    {
        HospitalName = g.Key,
        ClaimCount = g.Count(),
        TotalAmount = g.Sum(c => c.ClaimAmount)
    })
    .ToListAsync();
```

**Method: `GetHighValueClaimsAsync`**
```csharp
// Calculating Total Payout per policy (In-Memory after loading with Includes)
var totalPayout = policy.Claims
    .Where(c => c.Status == "Approved" || c.Status == "Paid")
    .Sum(c => c.ApprovedAmount ?? 0);
```

### 3. HospitalService.cs

**Method: `GetHospitalsAsync`**
```csharp
// Admin: Order and Map
return hospitals
    .OrderBy(h => h.HospitalName)
    .Select((h, i) => new HospitalAdminResponseDto { ... })
    .ToList();

// Public: Filter Active, Order and Map
return hospitals
    .Where(h => h.IsActive)
    .OrderBy(h => h.HospitalName)
    .Select((h, i) => new HospitalPublicResponseDto { ... })
    .ToList();
```

### 4. InsurancePlanService.cs

**Method: `GetPlansAsync`**
```csharp
// Admin: Order and Map
return plans
    .OrderBy(p => p.CreatedAt)
    .Select((p, i) => new InsurancePlanAdminResponseDto { ... })
    .ToList();

// Public: Filter Active, Order and Map
return plans
    .Where(p => p.IsActive)
    .OrderBy(p => p.CreatedAt)
    .Select((p, i) => new InsurancePlanPublicResponseDto { ... })
    .ToList();
```

### 5. PaymentService.cs

**Method: `GetPaymentsAsync`**
```csharp
// Filtering based on Role (In-Memory)
"Customer" => payments.Where(p => p.Policy != null && p.Policy.UserId == userId),

"Hospital" => payments.Where(p =>
    p.PaymentType == "Claim" &&
    p.Claim != null &&
    currentUser.HospitalId != null &&
    p.Claim.HospitalId == currentUser.HospitalId),

// Projection
return filtered.Select(p => new PaymentResponseDto { ... }).ToList();
```

### 6. PolicyService.cs

**Method: `GetPoliciesAsync`**
```csharp
// Filtering based on Role (In-Memory)
"Customer" => policies.Where(p => p.UserId == userId),

// Mapping (MapToDto)
ClaimsUsedAmount = p.Claims?
    .Where(c => c.Status == "Approved" || c.Status == "Paid")
    .Sum(c => c.ApprovedAmount ?? 0) ?? 0
```

### 7. UserService.cs

**Method: `GetAllUsersAsync`**
```csharp
// Getting single role from list
Role = roles.FirstOrDefault() 

// Flattening errors (Not strictly LINQ to Objects on entities, but LINQ usage)
string.Join(", ", result.Errors.Select(e => e.Description))
```

---

## Repositories

### 1. ClaimRepository.cs

**Method: `GetAllAsync`**
```csharp
return await _context.Claims
    .Include(c => c.Policy)
        .ThenInclude(p => p.User)
    .Include(c => c.Policy)
        .ThenInclude(p => p.Plan)
    .Include(c => c.Hospital)
    .ToListAsync();
```

**Method: `GetByIdAsync`**
```csharp
return await _context.Claims
    .Include(c => c.Policy)
    .Include(c => c.Hospital)
    .FirstOrDefaultAsync(c => c.ClaimsTableId == claimId);
```

### 2. HospitalRepository.cs

**Method: `GetByUserIdAsync`**
```csharp
return await _context.Hospitals
    .FirstOrDefaultAsync(h => h.UserId == userId);
```

### 3. NotificationRepository.cs

**Method: `GetByUserIdAsync`**
```csharp
return await _context.Notifications
    .Where(n => n.UserId == userId)
    .OrderByDescending(n => n.CreatedAt)
    .ToListAsync();
```

**Method: `GetUnreadByUserIdAsync`**
```csharp
return await _context.Notifications
    .Where(n => n.UserId == userId && !n.IsRead)
    .OrderByDescending(n => n.CreatedAt)
    .ToListAsync();
```

### 4. PaymentRepository.cs

**Method: `GetAllAsync`**
```csharp
return await _context.Payments
    .Include(p => p.Policy)
        .ThenInclude(pol => pol.User)
    .Include(p => p.Claim)
        .ThenInclude(c => c.Hospital)
    .ToListAsync();
```

**Method: `GetByPolicyIdAsync`**
```csharp
return await _context.Payments
    .Where(p => p.PolicyId == policyId)
    .ToListAsync();
```

### 5. PolicyRepository.cs

**Method: `GetAllAsync`**
```csharp
return await _context.Policies
    .Include(p => p.Plan)
    .Include(p => p.User)
    .Include(p => p.Claims)
    .ToListAsync();
```

**Method: `GetByIdAsync`**
```csharp
return await _context.Policies
    .Include(p => p.Plan)
    .Include(p => p.User)
    .Include(p => p.Claims)
    .FirstOrDefaultAsync(p => p.PolicyId == policyId);
```
