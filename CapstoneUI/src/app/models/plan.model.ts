export interface PublicPlan { //for public use home page
  planId: number;
  planName: string;
  coverageAmount: number;
  basePremium: number;
  durationMonths: number;
  description?: string;
}


export interface InsurancePlanAdminResponse {
    planId: number;
  planName: string;
  coverageAmount: number;
  basePremium: number;
  durationMonths: number;
  isActive: boolean;
  createdAt: string;
  description?: string;
  
}

export interface CreateInsurancePlan {
  planName: string;
  coverageAmount: number;
  durationMonths: number;
  description?: string;
}

export interface UpdateStatus {
  isActive: boolean;
}
