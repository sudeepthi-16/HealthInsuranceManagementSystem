import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { PolicyService } from '../../../../services/policy.service';
import { UserService } from '../../../../services/user.service';
import { PlanService } from '../../../../services/plan.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-policy-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './policy-dialog.html'
})
export class PolicyDialogComponent implements OnInit {

  customers: any[] = [];
  plans: any[] = [];

  selectedCustomerId: any = null;
  selectedPlanId: any = null;

  constructor(
    private dialogRef: MatDialogRef<PolicyDialogComponent>,
    private policyService: PolicyService,
    private userService: UserService,
    private planService: PlanService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDropdownData();
  }

  loadDropdownData() {
    forkJoin({
      users: this.userService.getUsers(),
      plans: this.planService.getPlans()
    }).subscribe({
      next: ({ users, plans }) => {
        this.customers = users.filter(
          u => u.role === 'Customer' && u.isActive
        );

        this.plans = plans.filter(p => p.isActive);

        // Fallback safety (same as inline)
        if (this.plans.length === 0) {
          this.plans = plans;
        }
         this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
      }
    });
  }

  createPolicy() {
    if (!this.selectedCustomerId || !this.selectedPlanId) {
      this.snackBar.open('Please select both customer and plan', 'Close', {
        duration: 3000
      });
      return;
    }

    this.policyService.createPolicy({
      customerId: this.selectedCustomerId,
      planId: this.selectedPlanId
    }).subscribe({
      next: () => {
        this.snackBar.open('Policy created successfully', 'Close', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Failed to create policy', 'Close', {
          duration: 3000
        });
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
