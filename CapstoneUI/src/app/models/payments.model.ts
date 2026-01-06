export interface PaymentResponse {
  paymentId: number;
  hospitalName?: string;
  customerCode: string;
  userFullName: string;
  amount: number;
  claimId?: number;
  paymentType: string;
  paymentDate: string; 
}


export interface MakePremiumPayment {
  policyId: number;
  amount: number;
}
