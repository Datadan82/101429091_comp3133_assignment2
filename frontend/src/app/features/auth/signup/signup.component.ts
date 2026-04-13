import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password        = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ mismatch: true });
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirm  = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username:        ['', [Validators.required, Validators.minLength(3)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get username()        { return this.form.get('username')!; }
  get email()           { return this.form.get('email')!; }
  get password()        { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { username, email, password } = this.form.value;

    this.auth.signup(username, email, password).subscribe({
      next: () => {
        this.snackBar.open('Account created! Welcome aboard.', '', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.graphQLErrors?.[0]?.message || 'Signup failed. Please try again.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
