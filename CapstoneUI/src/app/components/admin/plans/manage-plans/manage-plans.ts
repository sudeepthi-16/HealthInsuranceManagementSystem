import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PlanService } from '../../../../services/plan.service';
import { InsurancePlanAdminResponse } from '../../../../models/plan.model';
import { PlanDialogComponent } from '../plan-dialog/plan-dialog';

@Component({
  standalone: true,
  selector: 'app-manage-plans',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './manage-plans.html',
  styleUrls: ['./manage-plans.css']
})
export class ManagePlansComponent implements OnInit {

  dataSource = new MatTableDataSource<InsurancePlanAdminResponse>([]);

  displayedColumns = [
    'displayId',
    'planName',
    'coverageAmount',
    'basePremium',
    'durationMonths',
    'description',
    'status',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private planService: PlanService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    // Filter only by plan name
    this.dataSource.filterPredicate = (data, filter) =>
      data.planName.toLowerCase().includes(filter);

    this.loadPlans();
  }

  loadPlans() {
    this.planService.getAdminPlans().subscribe(plans => {
      this.dataSource.data = plans;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAdd() {
    this.openDialog();
  }

  openEdit(plan: InsurancePlanAdminResponse) {
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      width: '550px',
      data: plan   // ✅ reuse add dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlans();
      }
    });
  }


  toggleStatus(plan: InsurancePlanAdminResponse) {
    this.planService.updateStatus(plan.planId, !plan.isActive)
      .subscribe(() => {
        this.snack.open('Plan status updated', 'Close', { duration: 2000 });
        this.loadPlans();
      });
  }

  private openDialog(plan?: InsurancePlanAdminResponse) {
    const ref = this.dialog.open(PlanDialogComponent, {
      width: '550px',
      data: plan
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlans();
      }
    })
  };
}