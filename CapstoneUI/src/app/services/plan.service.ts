import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicPlan, CreateInsurancePlan, InsurancePlanAdminResponse } from '../models/plan.model';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private baseUrl = `${environment.apiBaseUrl}/plans`;

  constructor(private http: HttpClient) {}

  //  Public endpoint
  getPublicPlans() {
    return this.http.get<PublicPlan[]>(`${this.baseUrl}`);
  }

  // Admin endpoint
   getAdminPlans() {
    return this.http.get<InsurancePlanAdminResponse[]>(this.baseUrl);
  }

  createPlan(dto: CreateInsurancePlan) {
    return this.http.post(this.baseUrl, dto);
  }

  updatePlan(planId: number, dto: CreateInsurancePlan) {
    return this.http.put(`${this.baseUrl}/${planId}`, dto);
  }

  updateStatus(planId: number, isActive: boolean) {
    return this.http.put(`${this.baseUrl}/${planId}/status`, { isActive });
  }
   getPlans() {
    return this.http.get<InsurancePlanAdminResponse[]>(this.baseUrl);
  }
}
