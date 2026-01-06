import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { Policy } from '../../../../models/policy.model';

@Component({
  standalone: true,
  selector: 'app-policy-details-dialog',
  imports: [
    CommonModule,
    MatDialogModule,   // ✅ required for mat-dialog-close
    MatButtonModule
  ],
  templateUrl: './policy-details-dialog.html',
  styleUrls: ['./policy-details-dialog.css']
})
export class PolicyDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public policy: Policy
  ) { }

  get remainingCoverage(): number {
    return this.policy.coverageAmount - this.policy.claimsUsedAmount;
  }
}
