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
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PaymentService } from '../../../../services/payment.service';
import { PaymentResponse } from '../../../../models/payments.model';


import { MatDialog } from '@angular/material/dialog';
import { PayPremiumDialogComponent } from '../pay-premium-dialog/pay-premium-dialog';
import { PolicyService } from '../../../../services/policy.service';
import { Policy } from '../../../../models/policy.model';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class PaymentsComponent implements OnInit {

  displayedColumns = [
    'paymentId',
    'hospitalName',
    'amount',
    'type',
    'date'
  ];

  dataSource = new MatTableDataSource<PaymentResponse>([]);
  loading = signal(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  policies: Policy[] = [];

  constructor(
    private paymentService: PaymentService,
    private policyService: PolicyService,
    private dialog: MatDialog
  ) { }


  searchText = '';
  typeFilter = 'All';
  types = ['All', 'Premium', 'Claim'];

  ngOnInit() {
    this.dataSource.filterPredicate = (data: PaymentResponse, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const value = searchTerms.text.toLowerCase();
      const typeFilter = searchTerms.type;

      const id = data.paymentId?.toString().toLowerCase() || '';
      const hospital = data.hospitalName?.toLowerCase() || '';
      const amount = data.amount?.toString().toLowerCase() || '';
      const type = data.paymentType?.toLowerCase() || '';

      const matchesText = (
        id.includes(value) ||
        hospital.includes(value) ||
        amount.includes(value) ||
        type.includes(value)
      );

      const matchesType = typeFilter === 'All' || data.paymentType === typeFilter;

      return matchesText && matchesType;
    };

    this.loadPayments();
    this.loadPolicies();
  }

  updateFilter() {
    const filterValues = {
      text: this.searchText,
      type: this.typeFilter
    };
    this.dataSource.filter = JSON.stringify(filterValues);
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
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadPolicies() {
    this.policyService.getPolicies().subscribe(res => {
      this.policies = res.filter(p => p.status === 'Active');
    });
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

  // applyFilter replaced above
  openPayPremium() {
    this.dialog.open(PayPremiumDialogComponent, {
      width: '450px',
      data: this.policies
    }).afterClosed().subscribe(success => {
      if (success) {
        this.loadPayments(); // refresh history
      }
    });
  }

}
