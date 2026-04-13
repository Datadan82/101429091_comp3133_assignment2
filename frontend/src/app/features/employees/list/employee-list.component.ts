import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['avatar', 'name', 'department', 'designation', 'salary', 'date_of_joining', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);

  loading = true;
  searchDepartment  = '';
  searchDesignation = '';
  isSearchActive    = false;

  @ViewChild(MatSort)      sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort      = this.sort;
    this.dataSource.paginator = this.paginator;

    // Custom sort for full name
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') return `${item.first_name} ${item.last_name}`;
      return (item as any)[property];
    };
  }

  loadEmployees(): void {
    this.loading = true;
    this.empService.getAllEmployees().subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load employees.', 'Close', { duration: 3000 });
      }
    });
  }

  onSearch(): void {
    if (!this.searchDepartment && !this.searchDesignation) {
      this.clearSearch();
      return;
    }
    this.loading = true;
    this.isSearchActive = true;
    this.empService.searchEmployees(this.searchDepartment, this.searchDesignation).subscribe({
      next: (employees) => {
        this.dataSource.data = employees;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Search failed.', 'Close', { duration: 3000 });
      }
    });
  }

  clearSearch(): void {
    this.searchDepartment  = '';
    this.searchDesignation = '';
    this.isSearchActive    = false;
    this.loadEmployees();
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filter.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/employees', id]);
  }

  editEmployee(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.empService.deleteEmployee(id).subscribe({
      next: () => {
        this.snackBar.open('Employee deleted.', '', { duration: 3000 });
        this.loadEmployees();
      },
      error: () => {
        this.snackBar.open('Delete failed.', 'Close', { duration: 3000 });
      }
    });
  }

  getInitials(first: string, last: string): string {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  }
}
