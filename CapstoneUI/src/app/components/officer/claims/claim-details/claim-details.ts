import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { OfficerClaim } from '../../../../models/claim.model';
import { ClaimsService } from '../../../../services/claim.service';
import { ViewDocumentsDialogComponent } from '../../../shared/view-documents-dialog/view-documents-dialog.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './claim-details.html',
  styleUrls: ['./claim-details.css']
})
export class ClaimDetailsComponent {

  selectedAction: 'approve' | 'reject' | null = null;
  approvedAmount?: number;
  remarks = '';

  constructor(
    private dialogRef: MatDialogRef<ClaimDetailsComponent>,
    private claimsService: ClaimsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { claim: OfficerClaim }
  ) { }

  close() {
    this.dialogRef.close();
  }

  onActionChange(action: 'approve' | 'reject') {
    this.selectedAction = action;
    // Clear fields when switching actions
    if (action === 'approve') {
      this.remarks = '';
    } else {
      this.approvedAmount = undefined;
    }
  }

  canSubmit(): boolean {
    if (!this.selectedAction || this.data.claim.status !== 'InReview') {
      return false;
    }
    if (this.selectedAction === 'approve') {
      return !!this.approvedAmount && this.approvedAmount > 0;
    } else {
      return !!this.remarks && this.remarks.trim().length > 0;
    }
  }

  submitReview() {
    if (!this.canSubmit()) return;

    const isApproved = this.selectedAction === 'approve';
    this.claimsService.reviewClaim(
      this.data.claim.claimId,
      {
        isApproved,
        approvedAmount: isApproved ? this.approvedAmount : undefined,
        officerRemarks: isApproved ? '' : this.remarks
      }
    ).subscribe(() => this.dialogRef.close(true));
  }

  openViewDocsDialog() {
    if (this.data.claim && this.data.claim.claimId) {
      this.dialog.open(ViewDocumentsDialogComponent, {
        width: '500px',
        data: { claimId: this.data.claim.claimId }
      });
    }
  }
}
