import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClaimsService } from '../../../../services/claim.service';
import { HospitalClaim } from '../../../../models/claim.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './medical-notes-dialog.html',
  styleUrls: ['./medical-notes-dialog.css']
})
export class MedicalNotesDialogComponent {

  notes = '';

  constructor(
    private dialogRef: MatDialogRef<MedicalNotesDialogComponent>,
    private service: ClaimsService,
    @Inject(MAT_DIALOG_DATA) public data: { claim: HospitalClaim }
  ) {
    this.notes = data.claim.hospitalNotes || '';
  }

  save() {
    this.service
      .addMedicalNotes(this.data.claim.claimId, this.notes)
      .subscribe(() => this.dialogRef.close(true));
  }

  close() {
    this.dialogRef.close();
  }
}
