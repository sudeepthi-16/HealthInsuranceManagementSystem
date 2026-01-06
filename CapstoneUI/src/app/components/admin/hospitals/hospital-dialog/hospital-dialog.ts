import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { HospitalService } from '../../../../services/hospital.service';
import { HospitalAdminResponse, CreateHospital } from '../../../../models/hospital.model';

@Component({
  standalone: true,
  selector: 'app-hospital-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './hospital-dialog.html',
  styleUrls: ['./hospital-dialog.css'],
  encapsulation: ViewEncapsulation.None
})
export class HospitalDialogComponent {

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public hospital: HospitalAdminResponse | null,
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private dialogRef: MatDialogRef<HospitalDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      hospitalName: ['', Validators.required],
      city: ['', Validators.required],
      isNetworkHospital: [true]
    });

    if (this.hospital) {
      this.form.patchValue({
        hospitalName: this.hospital.hospitalName,
        city: this.hospital.city,
        isNetworkHospital: this.hospital.isNetworkHospital
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const dto: CreateHospital = this.form.value;

    if (this.hospital) {
      this.hospitalService
        .updateHospital(this.hospital.hospitalId, dto)
        .subscribe(() => {
          this.snackBar.open('Hospital updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        });
    } else {
      this.hospitalService
        .createHospital(dto)
        .subscribe(() => {
          this.snackBar.open('Hospital created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        });
    }
  }
  cancel() {
    this.dialogRef.close();
  }
}
