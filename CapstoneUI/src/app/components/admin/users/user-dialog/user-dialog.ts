import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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

import { UserService } from '../../../../services/user.service';
import { HospitalService } from '../../../../services/hospital.service';
import { HospitalAdminResponse } from '../../../../models/hospital.model';
import { CreateUser } from '../../../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-create-user-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './user-dialog.html',
  styleUrls: ['./user-dialog.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateUserDialogComponent implements OnInit {

  form!: FormGroup;

  hospitals: HospitalAdminResponse[] = [];
  hospitalsLoaded = false; // ✅ FIX for NG0100

  role!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) role: string,
    private fb: FormBuilder,
    private userService: UserService,
    private hospitalService: HospitalService,
    private dialogRef: MatDialogRef<CreateUserDialogComponent>
  ) {
    this.role = role;
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      hospitalId: [null]
    });

    if (this.role === 'Hospital') {
      this.loadHospitals();
    }
  }

  private loadHospitals(): void {
    this.hospitalService.getHospitals().subscribe({
      next: res => {
        this.hospitals = res.filter(h => h.isActive);
        this.hospitalsLoaded = true; // ✅ IMPORTANT
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const dto: CreateUser = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      password: this.form.value.password,
      role: this.role
    };

    if (this.role === 'Hospital') {
      dto.hospitalId = this.form.value.hospitalId;

      this.userService.createHospitalManager(dto)
        .subscribe(() => this.dialogRef.close(true));

    } else {
      this.userService.createUser(dto)
        .subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
