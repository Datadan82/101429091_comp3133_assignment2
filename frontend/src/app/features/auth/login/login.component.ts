import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/employees']);
      return;
    }

    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() { return this.form.get('username')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { username, password } = this.form.value;

    this.auth.login(username, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/employees');
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
        const msg = err?.graphQLErrors?.[0]?.message
          || err?.message
          || 'Invalid credentials. Please try again.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}