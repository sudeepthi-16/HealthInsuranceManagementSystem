import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { OfficerClaim } from '../../../../models/claim.model';
import { ClaimsService } from '../../../../services/claim.service';
import { ClaimDetailsComponent } from '../claim-details/claim-details';

@Component({
  standalone: true,
  selector: 'app-manage-claims',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './manage-claims.html',
  styleUrls: ['./manage-claims.css']
})
export class ManageClaimsComponent
  implements OnInit, AfterViewInit {

  loading = signal(false);

  displayedColumns = [
    'claimId',
    'customerName',
    'hospitalName',
    'status',
    'submittedDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<OfficerClaim>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private claimsService: ClaimsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadClaims();
  }



  loadClaims() {
    this.loading.set(true);
    this.claimsService.getClaims<OfficerClaim>().subscribe({
      next: res => {
        // Sort: InReview > Submitted > Approved > Paid > Rejected
        const statusOrder: { [key: string]: number } = {
          'InReview': 1,
          'Submitted': 2,
          'Approved': 3,
          'Paid': 4,
          'Rejected': 5
        };

        res.sort((a, b) => {
          const orderA = statusOrder[a.status] || 99;
          const orderB = statusOrder[b.status] || 99;
          return orderA - orderB;
        });

        this.dataSource.data = res;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  searchText = '';
  statusFilter = 'All';
  statuses = ['All', 'Submitted', 'InReview', 'Paid', 'Approved', 'Rejected'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: OfficerClaim, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const text = searchTerms.text.toLowerCase();
      const status = searchTerms.status;

      const matchesText = (
        data.claimId.toString().includes(text) ||
        data.customerName.toLowerCase().includes(text) ||
        data.hospitalName.toLowerCase().includes(text)
      );

      const matchesStatus = status === 'All' || data.status === status;

      return matchesText && matchesStatus;
    };
  }

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
    this.dataSource.paginator?.firstPage();
  }

  applyStatusFilter(status: string) {
    this.statusFilter = status;
    this.updateFilter();
    this.dataSource.paginator?.firstPage();
  }

  openDetails(claim: OfficerClaim) {
    this.dialog.open(ClaimDetailsComponent, {
      width: '700px',
      data: { claim }
    }).afterClosed().subscribe(refresh => {
      if (refresh) this.loadClaims();
    });
  }
}
