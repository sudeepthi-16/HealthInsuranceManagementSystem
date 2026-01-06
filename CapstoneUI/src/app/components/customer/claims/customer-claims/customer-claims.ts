import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ClaimsService } from '../../../../services/claim.service';
import { CustomerClaim } from '../../../../models/claim.model';
import { CustomerClaimDetailsDialogComponent } from '../claim-details-dialog/claim-details-dialog';

@Component({
  standalone: true,
  selector: 'app-customer-claims',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './customer-claims.html',
  styleUrls: ['./customer-claims.css']
})
export class CustomerClaimsComponent implements OnInit {

  displayedColumns = [
    'claimId',
    'status',
    'claimAmount',
    'approvedAmount',
    'submittedDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<CustomerClaim>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private claimsService: ClaimsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.claimsService.getCustomerClaims().subscribe(res => {

      // Sort: InReview > Submitted > Approved > Rejected > Paid
      const statusOrder: { [key: string]: number } = {
        'InReview': 1,
        'Submitted': 2,
        'Approved': 3,
        'Rejected': 4,
        'Paid': 5
      };

      this.dataSource.data = res.sort((a, b) => {
        const orderA = statusOrder[a.status] || 99;
        const orderB = statusOrder[b.status] || 99;
        return orderA - orderB;
      });

      this.dataSource.paginator = this.paginator;
    });

    // 🔍 Search across key fields
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerms = JSON.parse(filter);
      const value = searchTerms.text.toLowerCase();
      const statusFilter = searchTerms.status;

      const matchesText = (
        data.claimId.toString().includes(value) ||
        data.status.toLowerCase().includes(value) ||
        data.claimAmount.toString().includes(value)
      );

      const matchesStatus = statusFilter === 'All' || data.status === statusFilter;

      return matchesText && matchesStatus;
    };
  }

  searchText = '';
  statusFilter = 'All';
  statuses = ['All', 'Submitted', 'InReview', 'Approved', 'Paid', 'Rejected'];

  updateFilter() {
    const filterValues = {
      text: this.searchText,
      status: this.statusFilter
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.updateFilter();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  applyStatusFilter(status: string) {
    this.statusFilter = status;
    this.updateFilter();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }



  viewDetails(claim: CustomerClaim) {
    this.dialog.open(CustomerClaimDetailsDialogComponent, {
      width: '600px',
      data: claim
    });
  }
}
