export interface Policy {
  policyId: number;
  userId: string;
  userName: string;
  customerCode?: string;

  status: 'Active' | 'Expired' | 'Suspended';
  premiumStatus: 'Due' | 'Paid';

  startDate: string;
  endDate: string;
  nextDueDate?: string;

  totalPremium: number;
  planId: number;

  planName: string;
  coverageAmount: number;
  claimsUsedAmount: number;
}
export interface CreatePolicy {
  customerId: string; // AspNetUsers.Id
  planId: number;     // InsurancePlan.PlanId
}
