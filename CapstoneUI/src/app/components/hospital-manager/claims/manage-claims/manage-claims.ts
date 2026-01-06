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
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UploadDocumentDialogComponent } from '../upload-document-dialog/upload-document-dialog.component';
import { ViewDocumentsDialogComponent } from '../../../shared/view-documents-dialog/view-documents-dialog.component';

import { HospitalClaim, OfficerClaim } from '../../../../models/claim.model';
import { ClaimsService } from '../../../../services/claim.service';
import { MedicalNotesDialogComponent } from '../medical-notes-dialog/medical-notes-dialog';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-manage-claims',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
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
    'policyId',
    'status',
    'submittedDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<HospitalClaim>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: ClaimsService,
    private dialog: MatDialog
  ) { }


  searchText = '';
  statusFilter = 'All';
  // "manage claims component filter by ststus (inreview all submitted approved paid rejected)"
  statuses = ['InReview', 'All', 'Submitted', 'Approved', 'Paid', 'Rejected'];

  ngOnInit() {
    this.dataSource.filterPredicate = (data: HospitalClaim, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const value = searchTerms.text.toLowerCase();
      const statusFilter = searchTerms.status;

      const id = data.claimId.toString();
      const name = data.customerName.toLowerCase();
      const policy = data.policyId.toString();
      const status = data.status.toLowerCase();

      const matchesText = (
        id.includes(value) ||
        name.includes(value) ||
        policy.includes(value) ||
        status.includes(value)
      );

      const matchesStatus = statusFilter === 'All' || data.status === statusFilter;

      return matchesText && matchesStatus;
    };

    this.loadClaims();
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadClaims() {
    this.loading.set(true);
    this.service
      .getClaims<HospitalClaim>()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe((res: HospitalClaim[]) => {
        // Sort: InReview > Submitted > Paid > Approved > Rejected
        const statusOrder: { [key: string]: number } = {
          'InReview': 1,
          'Submitted': 2,
          'Approved': 3,
          'Rejected': 4,
          'Paid': 5
        };

        res.sort((a, b) => {
          const orderA = statusOrder[a.status] || 99;
          const orderB = statusOrder[b.status] || 99;
          return orderA - orderB;
        });

        this.dataSource.data = res;
      });

  }

  // applyFilter replaced above

  openNotes(claim: HospitalClaim) {
    this.dialog.open(MedicalNotesDialogComponent, {
      width: '500px',
      data: { claim }
    }).afterClosed().subscribe(refresh => {
    });
  }

  openUploadDialog(claimId: number) {
    this.dialog.open(UploadDocumentDialogComponent, {
      width: '400px',
      data: { claimId }
    });
  }

  openViewDocsDialog(claimId: number) {
    this.dialog.open(ViewDocumentsDialogComponent, {
      width: '500px',
      data: { claimId }
    });
  }
}
