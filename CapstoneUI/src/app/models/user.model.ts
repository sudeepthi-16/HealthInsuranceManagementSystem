export interface UserResponse {
  userId: string;
  fullName: string;
  role: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'InsuranceAgent' | 'ClaimsOfficer'| 'Hospital';
}
export interface CreateHospitalRequest {
 hospitalName: string;
  city: string;
  isNetworkHospital: boolean;
  email: string;
  password: string;
}
export interface UpdateStatusRequest {
  isActive: boolean;
}
export interface CreateUser {
  fullName: string;
  email: string;
  password: string;
  role: string;
  hospitalId?: number;
}
