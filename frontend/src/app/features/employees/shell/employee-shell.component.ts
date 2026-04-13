import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-shell',
  templateUrl: './employee-shell.component.html',
  styleUrls: ['./employee-shell.component.scss']
})
export class EmployeeShellComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
  }

  goToAdd(): void {
    this.router.navigate(['/employees/add']);
  }
}
