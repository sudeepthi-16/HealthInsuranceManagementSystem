export interface DashboardSummary {
  totalPremiumCollected: number;
  totalClaimsPaid: number;
}

export interface ClaimsByOfficer {
  officerName: string;
  approved: number;
  rejected: number;
}

export interface CountByStatus {
  status: string;
  count: number;
}

export interface ClaimsByHospital {
  hospitalName: string;
  claimCount: number;
  totalAmount: number;
}


export interface HighValueClaim {
  policyId: number;
  customerName: string;
  totalAmountUsed: number;
  coverageAmount: number;
}

// Agent Dashboard Models
export interface AgentSummary {
  totalPolicies: number;
  activePolicies: number;
  expiredPolicies: number;
  suspendedPolicies: number;
  premiumDue: number;
  premiumPaid: number;
}

export interface PremiumStatus {
  status: string; // 'Due' or 'Paid'
  count: number;
}

export interface PolicyNearingExpiry {
  policyNumber: string;
  customerName: string;
  expiryDate: string;
  daysRemaining: number;
}

// Officer Dashboard Models
export interface OfficerSummary {
  totalClaims: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}

export interface DecisionRatio {
  decision: string; // 'Approved' or 'Rejected'
  count: number;
}

// Hospital Dashboard Models
export interface HospitalSummary {
  totalClaims: number;
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  paid: number;
}
