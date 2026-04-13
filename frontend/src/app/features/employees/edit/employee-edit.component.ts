import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  form!: FormGroup;
  loading    = true;
  saving     = false;
  employeeId = '';
  photoPreview: string | null = null;
  photoBase64: string | null = null;

  departments  = ['Engineering','Marketing','Sales','HR','Finance','Operations','Design','Product'];
  designations = ['Manager','Senior Engineer','Junior Engineer','Analyst','Designer','Director','Intern'];
  genders      = ['Male','Female','Other'];

  constructor(
    private fb: FormBuilder,
    private empService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;

    this.form = this.fb.group({
      first_name:      ['', [Validators.required, Validators.minLength(2)]],
      last_name:       ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      gender:          ['', Validators.required],
      designation:     ['', Validators.required],
      department:      ['', Validators.required],
      salary:          ['', [Validators.required, Validators.min(0)]],
      date_of_joining: ['', Validators.required]
    });

    this.empService.getEmployeeById(this.employeeId).subscribe({
      next: (emp: Employee) => {
        this.form.patchValue({
          first_name:      emp.first_name,
          last_name:       emp.last_name,
          email:           emp.email,
          gender:          emp.gender,
          designation:     emp.designation,
          department:      emp.department,
          salary:          emp.salary,
          date_of_joining: emp.date_of_joining?.split('T')[0]
        });
        if (emp.employee_photo) {
          this.photoPreview = emp.employee_photo;
          this.photoBase64  = emp.employee_photo;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load employee.', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.photoPreview = e.target?.result as string;
      this.photoBase64  = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = {
      ...this.form.value,
      salary: parseFloat(this.form.value.salary),
      employee_photo: this.photoBase64 || ''
    };

    this.empService.updateEmployee(this.employeeId, payload).subscribe({
      next: () => {
        this.snackBar.open('Employee updated successfully!', '', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.graphQLErrors?.[0]?.message || 'Update failed.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
