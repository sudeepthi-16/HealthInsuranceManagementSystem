import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { RenewPolicyDialogComponent } from '../renew-policy-dialog/renew-policy-dialog';
import { Policy } from '../../../../models/policy.model';
import { PolicyService } from '../../../../services/policy.service';
import { UserService } from '../../../../services/user.service';
import { PlanService } from '../../../../services/plan.service';
import { PolicyDialogComponent } from '../policy-dialog/policy-dialog';
import { AgentPolicyDetailsDialogComponent } from '../agent-policy-details-dialog/agent-policy-details-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-manage-policies',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './manage-policies.html',
  styleUrls: ['./manage-policies.css']
})
export class ManagePoliciesComponent implements OnInit, AfterViewInit {


  // TABLE
  displayedColumns = [
    'policyNumber',
    'userName',
    'totalPremium', 
    'status',
    'premiumStatus',
    'startDate',
    'endDate',
    'nextDueDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<Policy>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // CREATE POLICY
  customers: any[] = [];
  plans: any[] = [];
  selectedCustomerId: any = null; 
  selectedPlanId: any = null; 

  constructor(
    private policyService: PolicyService,
    private userService: UserService,
    private planService: PlanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDropdownData();
    this.loadPolicies();
  }

  searchText = '';
  statusFilter = 'All';
  statuses = ['All', 'Active', 'Suspended', 'Expired'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: Policy, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const text = searchTerms.text.toLowerCase();
      const status = searchTerms.status;

      const matchesText = (
        data.userName?.toLowerCase().includes(text) ||
        data.status?.toLowerCase().includes(text) ||
        data.policyId.toString().includes(text) ||
        data.premiumStatus?.toLowerCase().includes(text)
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
    this.searchText = (event.target as HTMLInputElement).value;
    this.updateFilter();
  }

  applyStatusFilter(status: string) {
    this.statusFilter = status;
    this.updateFilter();
  }

  loadDropdownData() {
    forkJoin({
      users: this.userService.getUsers(),
      plans: this.planService.getPlans()
    }).subscribe({
      //debugging console logs
      next: ({ users, plans }) => {
        console.log(' Raw plans from API:', plans); 

        this.customers = users.filter(
          u => u.role === 'Customer' && u.isActive
        );

        this.plans = plans.filter(p => {
          console.log('Plan:', p.planName, 'isActive:', p.isActive);
          return p.isActive;
        });

        if (this.plans.length === 0) {
          console.warn('⚠️ No active plans found, showing all plans');
          this.plans = plans;
        }

        console.log('✅ Customers loaded:', this.customers);
        console.log('✅ Plans loaded:', this.plans);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(' Error loading dropdown data:', err);
        this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
      }
    });
  }

  // ✅ Add this method to debug selection
  onCustomerChange(value: any) {
    console.log('Customer selected:', value);
    this.selectedCustomerId = value;
  }

  onPlanChange(value: any) {
    console.log('Plan selected:', value);
    this.selectedPlanId = value;
  }

  createPolicy() {
    console.log('Creating policy with:', {
      customerId: this.selectedCustomerId,
      planId: this.selectedPlanId
    });

    if (!this.selectedCustomerId || !this.selectedPlanId) {
      this.snackBar.open('Please select both customer and plan', 'Close', {
        duration: 3000
      });
      return;
    }

    this.policyService.createPolicy({
      customerId: this.selectedCustomerId,
      planId: this.selectedPlanId
    }).subscribe({
      next: () => {
        this.snackBar.open('Policy created successfully', 'Close', {
          duration: 3000
        });
        this.selectedCustomerId = null;
        this.selectedPlanId = null;
        this.loadPolicies();
      },
      error: (err) => {
        console.error('Error creating policy:', err);
        this.snackBar.open('Failed to create policy', 'Close', {
          duration: 3000
        });
      }
    });
  }

  loadPolicies() {
    this.policyService.getPolicies().subscribe({
      next: res => {
        // Sort: 
        // 1. Active & Due (Top)
        // 2. Suspended (Bottom)
        // 3. Others (Middle)
        res.sort((a, b) => {
          const isPriorityA = a.status === 'Active' && a.premiumStatus === 'Due';
          const isPriorityB = b.status === 'Active' && b.premiumStatus === 'Due';
          if (isPriorityA && !isPriorityB) return -1;
          if (!isPriorityA && isPriorityB) return 1;

          const isSuspendedA = a.status === 'Suspended';
          const isSuspendedB = b.status === 'Suspended';
          if (isSuspendedA && !isSuspendedB) return 1; // Suspended goes to bottom
          if (!isSuspendedA && isSuspendedB) return -1;

          return 0;
        });

        console.log('✅ Loaded Policies. First item:', res[0]);
        this.dataSource.data = res;
      },
      error: err => console.error(err)
    });
  }

  // applyFilter replaced by new implementation above

  openPolicyDetails(policy: Policy) {
    this.dialog.open(AgentPolicyDetailsDialogComponent, {
      width: '500px',
      data: policy
    });
  }

  suspend(policy: Policy) {
    this.policyService.suspendPolicy(policy.policyId).subscribe(() => {
      this.snackBar.open('Policy suspended', 'Close', { duration: 3000 });
      this.loadPolicies();
    });
  }

  openRenewPolicy(policyId: number) {
    this.dialog.open(RenewPolicyDialogComponent, {
      width: '380px',
      data: policyId
    }).afterClosed().subscribe(ok => {
      if (ok) this.loadPolicies();
    });
  }
  openCreatePolicy() {
    this.dialog.open(PolicyDialogComponent, {
      width: '420px'
    }).afterClosed().subscribe(ok => {
      if (ok) this.loadPolicies();
    });
  }

}