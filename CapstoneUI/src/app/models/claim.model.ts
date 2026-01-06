
export interface Claim {
  id: number;
  policyId: number;
  hospitalName: string;
  claimAmount: number;
  approvedAmount?: number;
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Paid';
  notes?: string;
}

export interface CreateClaimRequest {
  policyId: number;
  hospitalId: number;
  claimAmount: number;
  description: string;
}

export interface ReviewClaimRequest {
  approvedAmount: number;
  remarks: string;
}

export interface MedicalNotesRequest {
  medicalNotes: string;
}

// =====================================================
// CLAIMS OFFICER VIEW
// =====================================================

export interface OfficerClaim {

  // Claim
  claimId: number;
  claimAmount: number;
  approvedAmount?: number;
  status: 'Submitted' | 'InReview' | 'Approved' | 'Rejected';
  submittedDate: string;

  // Customer
  customerId: string;
  customerName: string;

  // Hospital
  hospitalId: number;
  hospitalName: string;
  hospitalNotes?: string;

  // Policy
  policyId: number;
  policyNumber: string;
  coverageAmount: number;
  policyStatus: string;
  premiumStatus: 'Paid' | 'Due';
  policyStartDate: string;
  policyEndDate: string;

  // Plan
  planId: number;
  planName: string;

  // Coverage Tracking
  usedCoverageAmount: number;
  remainingCoverageAmount: number;

  // Notes
  customerDescription?: string;
  officerRemarks?: string;
}

// =====================================================
// HOSPITAL VIEW
// =====================================================

export interface HospitalClaim {
  claimId: number;
  policyId: number;
  hospitalId: number;

  claimAmount: number;
  approvedAmount?: number;

  customerDescription?: string;
  hospitalNotes?: string;

  status: 'Submitted' | 'InReview' | 'Approved' | 'Rejected'|'Paid';

  submittedDate: string;

  // Derived (backend already filters by hospital)
  customerId: string;
  customerName: string;
}

// =====================================================
// CUSTOMER VIEW (EXISTING – BACKEND ALIGNED)
// =====================================================

export interface ClaimResponse {
  claimId: number;
  policyId: number;
  hospitalId: number;

  customerCode: string;
  customerName: string;

  claimAmount: number;
  approvedAmount?: number;

  customerDescription?: string;
  officerRemarks?: string;
  hospitalNotes?: string;

  status: string;
  submittedDate: string; // ISO string from API
}

// =====================================================
// CUSTOMER – CREATE CLAIM (NEW, SAFE ADDITION)
// Matches CapStoneAPI.Dtos.Claims.CreateClaimDto
// =====================================================

export interface CreateCustomerClaim {
  policyId: number;
  hospitalId: number;
  claimAmount: number;
  customerDescription: string;
}

// =====================================================
// CUSTOMER – CLAIM RESPONSE ALIAS (READABILITY)
// =====================================================

// ================================
// CUSTOMER – CLAIM RESPONSE
// ================================
export interface CustomerClaim {
  claimId: number;

  claimAmount: number;
  approvedAmount?: number;
  status: string;
  submittedDate: string;

  policyId: number;

  hospitalId: number;
  hospitalName: string;
  hospitalNotes?: string;

  customerDescription?: string;

  // ✅ ADD THIS (Officer feedback to customer)
  officerRemarks?: string;
}

