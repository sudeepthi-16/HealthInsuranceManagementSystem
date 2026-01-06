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

import { HospitalService } from '../../../../services/hospital.service';
import { HospitalAdminResponse } from '../../../../models/hospital.model';
import { HospitalDialogComponent } from '../hospital-dialog/hospital-dialog';

@Component({
  standalone: true,
  selector: 'app-manage-hospitals',
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
  templateUrl: './manage-hospitals.html',
  styleUrls: ['./manage-hospitals.css']
})
export class ManageHospitalsComponent implements OnInit {

  dataSource = new MatTableDataSource<HospitalAdminResponse>([]);

  displayedColumns = [
    'hospitalId',
    'hospitalName',
    'city',
    'network',
    'status',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private hospitalService: HospitalService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataSource.filterPredicate = (data, filter) =>
      data.hospitalName.toLowerCase().includes(filter) ||
      data.city.toLowerCase().includes(filter);

    this.loadHospitals();
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe(hospitals => {
      this.dataSource.data = hospitals;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  openAdd() {
    this.openDialog();
  }

  openEdit(hospital: HospitalAdminResponse) {
    this.openDialog(hospital);
  }

  toggleStatus(hospital: HospitalAdminResponse) {
    this.hospitalService
      .updateStatus(hospital.hospitalId, !hospital.isActive)
      .subscribe(() => {
        this.snack.open('Hospital status updated', 'Close', { duration: 2000 });
        this.loadHospitals();
      });
  }

  private openDialog(hospital?: HospitalAdminResponse) {
    const ref = this.dialog.open(HospitalDialogComponent, {
      width: '550px',
      data: hospital
    });

    ref.afterClosed().subscribe(result => {
      if (result) this.loadHospitals();
    });
  }
}
