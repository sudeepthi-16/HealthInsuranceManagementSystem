export interface HospitalAdminResponse {
  hospitalId: number;
  hospitalName: string;
  city: string;
  isNetworkHospital: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateHospital {
  hospitalName: string;
  city: string;
  isNetworkHospital: boolean;
}
