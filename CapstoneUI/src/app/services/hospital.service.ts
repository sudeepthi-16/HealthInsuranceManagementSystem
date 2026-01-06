import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import {
  HospitalAdminResponse,
  CreateHospital
} from '../models/hospital.model';

@Injectable({ providedIn: 'root' })
export class HospitalService {

  private baseUrl = `${environment.apiBaseUrl}/hospitals`;

  constructor(private http: HttpClient) { }

  getHospitals() {
    return this.http.get<HospitalAdminResponse[]>(this.baseUrl);
  }

  createHospital(dto: CreateHospital) {
    return this.http.post(this.baseUrl, dto, { responseType: 'text' });
  }

  updateHospital(hospitalId: number, dto: CreateHospital) {
    return this.http.put(`${this.baseUrl}/${hospitalId}`, dto);
  }

  updateStatus(hospitalId: number, isActive: boolean) {
    return this.http.put(
      `${this.baseUrl}/${hospitalId}/status`,
      { isActive },
      { responseType: 'text' }
    );
  }
}
