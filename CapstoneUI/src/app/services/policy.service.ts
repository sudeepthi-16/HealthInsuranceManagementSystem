import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Policy } from '../models/policy.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  private baseUrl = `${environment.apiBaseUrl}/policies`;

  constructor(private http: HttpClient) {}


  // GET: View policies (role-filtered)

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.baseUrl);
  }


  // GET: Single policy

  getPolicyById(policyId: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.baseUrl}/${policyId}`);
  }


  // POST: Create policy (InsuranceAgent)

  createPolicy(dto: {
    customerId: string;
    planId: number;
  }): Observable<string> {
    return this.http.post(
      this.baseUrl,
      dto,
      { responseType: 'text' }
    );
  }


  // PUT: Suspend policy (InsuranceAgent)

  suspendPolicy(policyId: number): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/${policyId}/suspend`,
      {},
      { responseType: 'text' }
    );
  }


  // POST: Renew policy (InsuranceAgent)

  renewPolicy(
    policyId: number,
    additionalMonths: number
  ): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/${policyId}/renew`,
      { additionalMonths },
      { responseType: 'text' }
    );
  }
}
