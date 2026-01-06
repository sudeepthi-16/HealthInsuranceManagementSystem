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
import { MatSelectModule } from '@angular/material/select';

import { PaymentService } from '../../../services/payment.service';
import { PaymentResponse } from '../../../models/payments.model';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule
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

      const pId = data.paymentId?.toString().toLowerCase() || '';
      const cCode = data.customerCode?.toLowerCase() || '';
      const uName = data.userFullName?.toLowerCase() || '';
      const amt = data.amount?.toString().toLowerCase() || '';
      const pType = data.paymentType?.toLowerCase() || '';

      const matchesText = (
        pId.includes(f) ||
        cCode.includes(f) ||
        uName.includes(f) ||
        amt.includes(f) ||
        pType.includes(f)
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
      },
      // error: err => {
      //   this.error(
      //     err.error?.message || 'Failed to load payments'
      //   );
      //   this.loading.set(false);
      // }
    });
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.updateFilter();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  applyTypeFilter(type: string) {
    this.typeFilter = type;
    this.updateFilter();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
}
