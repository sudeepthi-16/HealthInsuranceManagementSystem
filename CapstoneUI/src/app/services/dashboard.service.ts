import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import {
  DashboardSummary,
  ClaimsByOfficer,
  CountByStatus,
  ClaimsByHospital,
  HighValueClaim,
  AgentSummary,
  PremiumStatus,
  PolicyNearingExpiry,
  OfficerSummary,
  DecisionRatio,
  HospitalSummary
} from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private baseUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  // Admin Dashboard
  getSummary() {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  getClaimsByOfficer() {
    return this.http.get<ClaimsByOfficer[]>(`${this.baseUrl}/claims-by-officer`);
  }

  getPoliciesByStatus() {
    return this.http.get<CountByStatus[]>(`${this.baseUrl}/policies-by-status`);
  }

  getClaimsByStatus() {
    return this.http.get<CountByStatus[]>(`${this.baseUrl}/claims-by-status`);
  }

  getClaimsByHospital() {
    return this.http.get<ClaimsByHospital[]>(`${this.baseUrl}/claims-by-hospital`);
  }

  getHighValueClaims() {
    return this.http.get<HighValueClaim[]>(`${this.baseUrl}/high-value-claims`);
  }

  // Agent Dashboard
  getAgentSummary() {
    return this.http.get<AgentSummary>(`${this.baseUrl}/agent/summary`);
  }

  getAgentPoliciesByStatus() {
    return this.http.get<CountByStatus[]>(`${this.baseUrl}/agent/policies-by-status`);
  }


  getAgentPremiumSummary() {
    return this.http.get<any>(`${this.baseUrl}/agent/premium-summary`);
  }

  getAgentClaimsByStatus() {
    return this.http.get<CountByStatus[]>(`${this.baseUrl}/agent/claims-by-status`);
  }

  // Officer Dashboard
  getOfficerSummary() {
    return this.http.get<OfficerSummary>(`${this.baseUrl}/officer/summary`);
  }

  getOfficerPendingClaims() {
    return this.http.get<any[]>(`${this.baseUrl}/officer/pending-claims`);
  }

  getOfficerClaimsByStatus() {
    return this.http.get<CountByStatus[]>(`${this.baseUrl}/officer/claims-by-status`);
  }

  getOfficerDecisionRatio() {
    return this.http.get<DecisionRatio[]>(`${this.baseUrl}/officer/decision-ratio`);
  }

  // Hospital Dashboard
  getHospitalSummary() {
    return this.http.get<HospitalSummary>(`${this.baseUrl}/hospital/summary`);
  }

  getHospitalClaimsByStatus() {
    return this.http.get<CountByStatus[]>(`${this.baseUrl}/hospital/claims-by-status`);
  }

  getHospitalPendingNotes() {
    return this.http.get<any[]>(`${this.baseUrl}/hospital/pending-notes`);
  }
}
