import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UserResponse, CreateUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private baseUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) { }

  // Admin: list all users
  getUsers() {
    return this.http.get<UserResponse[]>(this.baseUrl);
  }

  // Admin: create user (Agent / Officer )
  createUser(dto: CreateUser) {
    return this.http.post(this.baseUrl, dto);
  }

  //Admin Create user (Hospital Manager)
  createHospitalManager(dto: CreateUser) {
    return this.http.post(`${this.baseUrl}/hospital-managers`, dto);
  }
 
  // Admin: activate / deactivate user
  updateStatus(userId: string, isActive: boolean) {
    return this.http.put(
      `${this.baseUrl}/${userId}/status`,
      { isActive } // matches UpdateStatusDto
    );
  }
}
