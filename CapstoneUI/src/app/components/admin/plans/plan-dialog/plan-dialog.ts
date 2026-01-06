import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { PlanService } from '../../../../services/plan.service';
import { InsurancePlanAdminResponse } from '../../../../models/plan.model';
import { CreateInsurancePlan } from '../../../../models/plan.model';

@Component({
  standalone: true,
  selector: 'app-plan-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './plan-dialog.html',
  styleUrls: ['./plan-dialog.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlanDialogComponent {

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public plan: InsurancePlanAdminResponse | null,
    private fb: FormBuilder,
    private planService: PlanService,
    private dialogRef: MatDialogRef<PlanDialogComponent>
  ) {

    this.form = this.fb.group({
      planName: ['', Validators.required],
      coverageAmount: [0, Validators.required],
      durationMonths: [0, Validators.required],
      description: ['']
    });

    if (this.plan) {
      this.form.patchValue({
        planName: this.plan.planName,
        coverageAmount: this.plan.coverageAmount,
        durationMonths: this.plan.durationMonths
      });
    }
  }


  save() {
    if (this.form.invalid) return;

    const dto: CreateInsurancePlan = this.form.value;

    if (this.plan) {
  
      this.planService
        .updatePlan(this.plan.planId, dto)
        .subscribe(() => this.dialogRef.close(true));
    } else {

      this.planService
        .createPlan(dto)
        .subscribe(() => this.dialogRef.close(true));
    }
  }
  cancel() {
    this.dialogRef.close();
  }
}
