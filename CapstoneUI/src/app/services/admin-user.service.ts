import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UserResponse, CreateUserRequest, CreateHospitalRequest } from '../models/user.model';
import { HospitalAdminResponse } from '../models/hospital.model';

@Injectable({ providedIn: 'root' })
export class AdminUserService {

  private baseUrl = environment.apiBaseUrl;
    private hospitalsUrl = `${environment.apiBaseUrl}/admin/hospitals`;

  constructor(private http: HttpClient) {}

  // 👀 Get all users
  getUsers() {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/users`);
  }

  // ➕ Create Agent / Officer
  createUser(data: CreateUserRequest) {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  createHospital(dto: CreateHospitalRequest) {
    return this.http.post(
      this.hospitalsUrl,
      dto,
      { responseType: 'text' } // 👈 VERY IMPORTANT
    );
  }
  getHospitals() {
  return this.http.get<HospitalAdminResponse[]>(`${environment.apiBaseUrl}/hospitals`);
}


  // 🔁 Activate / Deactivate
  toggleUserStatus(userId: string) {
    return this.http.put(
      `${this.baseUrl}/user/${userId}/status`,
      {}
    );
  }
}
