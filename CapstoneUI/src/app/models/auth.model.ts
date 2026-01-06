export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  // role: 'Admin' | 'InsuranceAgent' | 'ClaimsOfficer' | 'Hospital' | 'Customer';
}

export interface RegisterRequest {
  FullName: string;
  email: string;
  password: string;
}
