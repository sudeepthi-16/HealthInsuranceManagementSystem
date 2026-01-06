import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PaymentResponse,MakePremiumPayment } from '../models/payments.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = `${environment.apiBaseUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPayments() {
    return this.http.get<PaymentResponse[]>(this.baseUrl);
  }
  payPremium(dto: MakePremiumPayment) {
  return this.http.post(
    `${this.baseUrl}/premium`,
    dto,
    { responseType: 'text' }
  );
}
}
