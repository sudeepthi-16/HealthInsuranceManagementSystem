import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomerClaim } from '../../../../models/claim.model';

@Component({
  standalone: true,
  selector: 'app-customer-claim-details-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './claim-details-dialog.html',
  styleUrls: ['./claim-details-dialog.css']
})
export class CustomerClaimDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public claim: CustomerClaim
  ) {}
}
