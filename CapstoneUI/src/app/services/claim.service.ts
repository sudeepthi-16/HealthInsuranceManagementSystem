import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  OfficerClaim,
  HospitalClaim,
  CreateCustomerClaim,
  CustomerClaim
} from '../models/claim.model';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  // Base API URL 
  private readonly baseUrl = `${environment.apiBaseUrl}/claims`;

  constructor(private http: HttpClient) {}

 

  getClaims<T = OfficerClaim | HospitalClaim>(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  

  createClaim(dto: CreateCustomerClaim): Observable<string> {
    return this.http.post(
      this.baseUrl,
      dto,
      { responseType: 'text' }
    );
  }

 

  getCustomerClaims(): Observable<CustomerClaim[]> {
    return this.http.get<CustomerClaim[]>(this.baseUrl);
  }



  reviewClaim(
    claimId: number,
    dto: {
      isApproved: boolean;
      approvedAmount?: number;
      officerRemarks: string;
    }
  ): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/${claimId}/review`,
      dto,
      { responseType: 'text' }
    );
  }

 

  addMedicalNotes(
    claimId: number,
    hospitalNotes: string
  ): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/${claimId}/medical-notes`,
      { hospitalNotes },
      { responseType: 'text' }
    );
  }
}
