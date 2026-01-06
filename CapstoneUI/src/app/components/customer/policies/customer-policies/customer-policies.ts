import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PolicyService } from '../../../../services/policy.service';
import { Policy } from '../../../../models/policy.model';

import { RaiseClaimDialogComponent } from '../../claims/raise-claim-dialog/raise-claim-dialog';
import { PolicyDetailsDialogComponent } from '../policy-details-dialog/policy-details-dialog';

@Component({
  standalone: true,
  selector: 'app-customer-policies',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './customer-policies.html',
  styleUrls: ['./customer-policies.css']
})
export class CustomerPoliciesComponent implements OnInit {

  displayedColumns = [
    'policyId',
    'status',
    'premiumStatus',
    'startDate',
    'endDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<Policy>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private policyService: PolicyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.policyService.getPolicies().subscribe({
      next: res => {
        // Sort: Active & Due (Top)
        // Sort: Active&Due > Active&Paid > Others > Suspended
        res.sort((a, b) => {
          const getScore = (p: Policy) => {
            if (p.status === 'Active' && p.premiumStatus === 'Due') return 1;
            if (p.status === 'Active' && p.premiumStatus === 'Paid') return 2;
            if (p.status === 'Suspended') return 4;
            return 3;
          };
          return getScore(a) - getScore(b);
        });

        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      }
    });

    // 🔎 Optional: custom filter behavior
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerms = JSON.parse(filter);
      const value = searchTerms.text.toLowerCase();
      const statusFilter = searchTerms.status;

      const matchesText = (
        data.policyId.toString().includes(value) ||
        data.status.toLowerCase().includes(value) ||
        data.premiumStatus.toLowerCase().includes(value)
      );

      const matchesStatus = statusFilter === 'All' || data.status === statusFilter;

      return matchesText && matchesStatus;
    };
  }

  searchText = '';
  statusFilter = 'All';
  statuses = ['All', 'Active', 'Suspended', 'Expired'];

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

  // applyFilter replaced above

  viewPolicyDetails(policy: Policy) {
    this.dialog.open(PolicyDetailsDialogComponent, {
      width: '600px',
      data: policy
    });
  }

  raiseClaim(policy: Policy) {
    this.dialog.open(RaiseClaimDialogComponent, {
      width: '500px',
      data: { policyId: policy.policyId }
    });
  }

  isClaimDisabled(policy: Policy): boolean {
    return policy.status !== 'Active';
  }
}
