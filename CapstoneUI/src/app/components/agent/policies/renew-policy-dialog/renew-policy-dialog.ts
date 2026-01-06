import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { PolicyService } from '../../../../services/policy.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './renew-policy-dialog.html'
})
export class RenewPolicyDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<RenewPolicyDialogComponent>,
    private policyService: PolicyService,
    @Inject(MAT_DIALOG_DATA) public policyId: number
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.policyService.renewPolicy(this.policyId, 12)
      .subscribe(() => this.dialogRef.close(true));
  }
}
