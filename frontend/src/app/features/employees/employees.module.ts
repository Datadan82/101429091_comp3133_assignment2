import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { EmployeeListComponent } from './list/employee-list.component';
import { EmployeeAddComponent } from './add/employee-add.component';
import { EmployeeEditComponent } from './edit/employee-edit.component';
import { EmployeeDetailComponent } from './detail/employee-detail.component';
import { EmployeeShellComponent } from './shell/employee-shell.component';
import { SalaryPipe } from '../../shared/pipes/salary.pipe';
import { DefaultAvatarPipe } from '../../shared/pipes/default-avatar.pipe';

const routes: Routes = [
  {
    path: '',
    component: EmployeeShellComponent,
    children: [
      { path: '',         component: EmployeeListComponent },
      { path: 'add',      component: EmployeeAddComponent },
      { path: 'edit/:id', component: EmployeeEditComponent },
      { path: ':id',      component: EmployeeDetailComponent }
    ]
  }
];

@NgModule({
  declarations: [
    EmployeeShellComponent,
    EmployeeListComponent,
    EmployeeAddComponent,
    EmployeeEditComponent,
    EmployeeDetailComponent,
    SalaryPipe,
    DefaultAvatarPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule,
    MatTooltipModule, MatChipsModule, MatCardModule,
    MatMenuModule, MatDividerModule
  ]
})
export class EmployeesModule {}