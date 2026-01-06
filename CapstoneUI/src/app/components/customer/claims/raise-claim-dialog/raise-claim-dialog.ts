import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { ClaimsService } from '../../../../services/claim.service';
import { HospitalService } from '../../../../services/hospital.service';
import { HospitalAdminResponse } from '../../../../models/hospital.model';

@Component({
  standalone: true,
  selector: 'app-raise-claim-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './raise-claim-dialog.html',
  styleUrls: ['./raise-claim-dialog.css']
})
export class RaiseClaimDialogComponent implements OnInit {

  form!: FormGroup;

  hospitals: HospitalAdminResponse[] = [];
  hospitalsLoaded = false; // used safely with change detector

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { policyId: number },
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private hospitalService: HospitalService,
    private dialogRef: MatDialogRef<RaiseClaimDialogComponent>,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      claimAmount: [null, [Validators.required, Validators.min(1)]],
      hospitalId: [null, Validators.required],
      customerDescription: ['']
    });

    this.loadHospitals();
  }

  private loadHospitals(): void {
    this.hospitalService.getHospitals().subscribe({
      next: res => {
        console.log('Hospitals received:', res);

      
        this.hospitals = res;

        this.hospitalsLoaded = true;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to load hospitals', err);
        this.hospitalsLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }


  submit(): void {
    if (this.form.invalid) return;

    this.claimsService.createClaim({
      policyId: this.data.policyId,
      claimAmount: this.form.value.claimAmount,
      hospitalId: this.form.value.hospitalId,
      customerDescription: this.form.value.customerDescription
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Claim creation failed', err)
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
