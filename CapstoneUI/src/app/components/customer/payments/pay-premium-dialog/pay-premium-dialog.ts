import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PaymentService } from '../../../../services/payment.service';
import { MakePremiumPayment } from '../../../../models/payments.model';
import { Policy } from '../../../../models/policy.model';

@Component({
  standalone: true,
  selector: 'app-pay-premium-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './pay-premium-dialog.html',
  styleUrls: ['./pay-premium-dialog.css']
})
export class PayPremiumDialogComponent {

  policyId!: number;
  amount!: number;
  submitting = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public policies: Policy[],
    private dialogRef: MatDialogRef<PayPremiumDialogComponent>,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  submit() {
    if (!this.policyId || !this.amount) {
      this.snackBar.open('Please select policy and enter amount', 'Close', {
        duration: 3000
      });
      return;
    }

    const dto: MakePremiumPayment = {
      policyId: this.policyId,
      amount: this.amount
    };

    this.submitting = true;

    this.paymentService.payPremium(dto).subscribe({
      next: () => {
        this.snackBar.open(
          'Premium payment successful',
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: err => {
  this.submitting = false;

  let message: string | null = null;

  if (typeof err.error === 'string') {
    // Strip "System.ApplicationException:" and stack trace
    if (err.error.includes(':')) {
      message = err.error.split(':').slice(1).join(':').trim();
    } else {
      message = err.error.trim();
    }
  }

  // 🔒 FINAL FALLBACK WITH AMOUNT
  if (!message || message.length > 150) {
    const premium = this.selectedPolicyPremium;
    message = premium
      ? `Please pay the full annual premium of ₹${premium}.`
      : 'Please pay the full annual premium for this policy.';
  }

  this.snackBar.open(message, 'Close', {
    duration: 4000
  });
}

    });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 4000
    });
  }
  get selectedPolicyPremium(): number | null {
  const policy = this.policies.find(p => p.policyId === this.policyId);
  return policy ? policy.totalPremium : null;
}

}
