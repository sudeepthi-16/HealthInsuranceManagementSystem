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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { PaymentService } from '../../../services/payment.service';
import { PaymentResponse } from '../../../models/payments.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class PaymentsComponent implements OnInit {

  displayedColumns = [
    'paymentId',
    'customerCode',
    'userFullName',
    'hospitalName',     
    'amount',
    'type',
    'date'
  ];

  dataSource = new MatTableDataSource<PaymentResponse>([]);
  loading = signal(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchText = '';
  typeFilter = 'All';
  types = ['All', 'Premium', 'Claim'];

  constructor(
    private paymentService: PaymentService,
  ) { }

  ngOnInit() {
    this.dataSource.filterPredicate = (data: PaymentResponse, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const f = searchTerms.text.toLowerCase();
      const typeFilter = searchTerms.type;

      const id = data.paymentId?.toString().toLowerCase() || '';
      const code = data.customerCode?.toLowerCase() || '';
      const name = data.userFullName?.toLowerCase() || '';
      const hospital = data.hospitalName?.toLowerCase() || '';
      const type = data.paymentType?.toLowerCase() || '';
      const amount = data.amount?.toString().toLowerCase() || '';

      const matchesText = (
        id.includes(f) ||
        code.includes(f) ||
        name.includes(f) ||
        hospital.includes(f) ||
        type.includes(f) ||
        amount.includes(f)
      );

      const matchesType = typeFilter === 'All' || data.paymentType === typeFilter;

      return matchesText && matchesType;
    };

    this.loadPayments();
  }

  updateFilter() {
    const filterValues = {
      text: this.searchText,
      type: this.typeFilter
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  loadPayments() {
    this.loading.set(true);

    this.paymentService.getPayments().subscribe({
      next: res => {
        // Sort: Latest first
        res.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.loading.set(false);
      }
    });
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.updateFilter();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyTypeFilter(type: string) {
    this.typeFilter = type;
    this.updateFilter();
    // Paginator reset handled in filter update via datasource? No, filter reset usually needs manual page reset if desired.
    // Standard MAT table behavior resets page on filter change if wired up, but explicit reset is safer.
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
