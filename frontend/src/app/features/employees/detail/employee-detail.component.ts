import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.empService.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.loading  = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Employee not found.', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      }
    });
  }

  edit(): void {
    this.router.navigate(['/employees/edit', this.employee!._id]);
  }

  back(): void {
    this.router.navigate(['/employees']);
  }

  delete(): void {
    if (!confirm('Delete this employee? This action cannot be undone.')) return;
    this.empService.deleteEmployee(this.employee!._id).subscribe({
      next: () => {
        this.snackBar.open('Employee deleted.', '', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.snackBar.open('Delete failed.', 'Close', { duration: 3000 });
      }
    });
  }

  getInitials(): string {
    if (!this.employee) return '';
    return `${this.employee.first_name?.[0] ?? ''}${this.employee.last_name?.[0] ?? ''}`.toUpperCase();
  }
}
