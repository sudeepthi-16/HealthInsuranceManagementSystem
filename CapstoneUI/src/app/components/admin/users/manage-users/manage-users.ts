import {
  Component,
  OnInit,
  signal,
  ViewChild,
  effect, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { UserResponse } from '../../../../models/user.model';
import { CreateUserDialogComponent } from '../user-dialog/user-dialog';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './manage-users.html'
})
export class ManageUsersComponent implements OnInit, AfterViewInit {

  users = signal<UserResponse[]>([]);
  loading = signal(true);
  dataSource = new MatTableDataSource<UserResponse>();

  searchText = '';
  selectedRole = 'All';

  cols = ['name', 'email', 'role', 'status'];
  roles = ['All', 'Customer', 'InsuranceAgent', 'ClaimsOfficer', 'Hospital', 'Admin'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {
    //  Sync signal → table datasource
    effect(() => {
      this.dataSource.data = this.users();
      this.dataSource.filterPredicate = this.createFilter();
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  createFilter(): (data: UserResponse, filter: string) => boolean {
    return (data: UserResponse, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const nameMatch = data.fullName.toLowerCase().includes(searchTerms.text);
      const emailMatch = data.email.toLowerCase().includes(searchTerms.text);
      const roleMatch = searchTerms.role === 'All' || data.role === searchTerms.role;

      return (nameMatch || emailMatch) && roleMatch;
    };
  }

  updateFilter() {
    const filterValues = {
      text: this.searchText.toLowerCase(),
      role: this.selectedRole
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: res => {
        this.users.set(res);
        this.loading.set(false);
      },
      error: err => {
        this.snack.open(
          err.error?.message || 'Failed to load users',
          'Close',
          { duration: 3000 }
        );
        this.loading.set(false);
      }
    });
  }

  
  openAddDialog() {
    const ref = this.dialog.open(CreateUserDialogComponent, {
      // width: '500px'
    });

    ref.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadUsers(); // refresh table after create
      }
    });
  }

  toggleStatus(user: UserResponse, event: any) {
    const currentUserEmail = this.authService.getUserEmail();

    if (user.email === currentUserEmail) {
      this.snack.open("You cannot disable your own account.", "Close", { duration: 3000 });
      // Revert the visual toggle state immediately
      event.source.checked = !event.checked;
      return;
    }

    const newStatus = !user.isActive;

    this.userService.updateStatus(user.userId, newStatus).subscribe({
      next: () => {
        this.users.update(list =>
          list.map(u =>
            u.userId === user.userId
              ? { ...u, isActive: newStatus }
              : u
          )
        );

        this.snack.open(
          'User status updated',
          'Close',
          { duration: 2000 }
        );
      },
      error: err => {
        // Revert on error
        event.source.checked = !event.checked;
        this.snack.open(
          err.error?.message || 'Failed to update status',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  getDisplayRole(role: string): string {
    return role === 'Hospital' ? 'Hospital Manager' : role;
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.updateFilter();
  }

  applyRoleFilter(role: string) {
    this.selectedRole = role;
    this.updateFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  openCreateUser(role: 'InsuranceAgent' | 'ClaimsOfficer' | 'Hospital' | 'Admin') {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '500px',
      data: role
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

}
