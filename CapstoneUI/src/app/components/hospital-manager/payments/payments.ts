import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { PaymentService } from '../../../services/payment.service';
import { PaymentResponse } from '../../../models/payments.model';

@Component({
  standalone: true,
  selector: 'app-hospital-payments',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class HospitalPaymentsComponent implements OnInit {

  displayedColumns = [
    'paymentId',
    'claimId',                // ✅ NEW
    'insuranceCompany',       // ✅ STATIC
    'customerCode',
    'userFullName',
    'amount',
    'paymentDate'
  ];

  dataSource = new MatTableDataSource<PaymentResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.paymentService.getPayments().subscribe({
      next: res => {
        // Sort: Latest first
        res.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      }
    });

    // 🔍 Search across relevant columns
    this.dataSource.filterPredicate = (data, filter) => {
      const value = filter.toLowerCase();
      return (
        data.paymentId.toString().includes(value) ||
        data.claimId?.toString().includes(value) ||
        data.customerCode?.toLowerCase().includes(value) ||
        data.userFullName?.toLowerCase().includes(value) ||
        data.amount.toString().includes(value)
      );
    };
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
