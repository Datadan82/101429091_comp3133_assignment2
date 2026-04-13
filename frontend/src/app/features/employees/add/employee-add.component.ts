import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  photoPreview: string | null = null;
  photoBase64: string | null = null;

  departments = ['Engineering','Marketing','Sales','HR','Finance','Operations','Design','Product'];
  designations = ['Manager','Senior Engineer','Junior Engineer','Analyst','Designer','Director','Intern'];
  genders = ['Male','Female','Other'];

  constructor(
    private fb: FormBuilder,
    private empService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      first_name:    ['', [Validators.required, Validators.minLength(2)]],
      last_name:     ['', [Validators.required, Validators.minLength(2)]],
      email:         ['', [Validators.required, Validators.email]],
      gender:        ['', Validators.required],
      designation:   ['', Validators.required],
      department:    ['', Validators.required],
      salary:        ['', [Validators.required, Validators.min(0)]],
      date_of_joining: ['', Validators.required]
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

    this.loading = true;
    const payload = {
      ...this.form.value,
      salary: parseFloat(this.form.value.salary),
      employee_photo: this.photoBase64 || ''
    };

    this.empService.addEmployee(payload).subscribe({
      next: () => {
        this.snackBar.open('Employee added successfully!', '', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.graphQLErrors?.[0]?.message || 'Failed to add employee.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
