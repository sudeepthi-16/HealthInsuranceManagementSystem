import {
  Component,
  OnInit,
  ViewChild,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { PaymentService } from '../../../services/payment.service';
import { PaymentResponse } from '../../../models/payments.model';


@Component({
  standalone: true,
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
export class PaymentsComponent implements OnInit {

  displayedColumns = ['paymentId',
  'customerCode',
  'userFullName',
  'amount',
  'type',
  'date'];
  dataSource = new MatTableDataSource<PaymentResponse>([]);
  loading = signal(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private paymentService: PaymentService,
  ) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading.set(true);

    this.paymentService.getPayments().subscribe({
      next: res => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.loading.set(false);
      },
      error: err => {
        console.error('Error loading payments:', err);
      }
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
