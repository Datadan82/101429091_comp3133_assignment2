import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
  GET_ALL_EMPLOYEES, GET_EMPLOYEE_BY_ID, SEARCH_EMPLOYEES,
  ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE
} from '../graphql/queries';

export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  department: string;
  salary: number;
  date_of_joining: string;
  employee_photo?: string;
}

export interface EmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  department: string;
  salary: number;
  date_of_joining: string;
  employee_photo?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.watchQuery<{ getAllEmployees: Employee[] }>({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'cache-and-network'
    }).valueChanges.pipe(
      map(res => res.data.getAllEmployees)
    );
  }

  getEmployeeById(eid: string): Observable<Employee> {
    return this.apollo.query<{ searchEmployeeById: Employee }>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { eid }
    }).pipe(map(res => res.data.searchEmployeeById));
  }

  searchEmployees(department?: string, designation?: string): Observable<Employee[]> {
    return this.apollo.query<{ searchEmployeeByDesignationOrDepartment: Employee[] }>({
      query: SEARCH_EMPLOYEES,
      variables: {
        department: department || null,
        designation: designation || null
      },
      fetchPolicy: 'network-only'
    }).pipe(map(res => res.data.searchEmployeeByDesignationOrDepartment));
  }

  addEmployee(input: EmployeeInput): Observable<Employee> {
    return this.apollo.mutate<{ addEmployee: Employee }>({
      mutation: ADD_EMPLOYEE,
      variables: input,
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(map(res => res.data!.addEmployee));
  }

  updateEmployee(eid: string, input: Partial<EmployeeInput>): Observable<Employee> {
    return this.apollo.mutate<{ updateEmployee: Employee }>({
      mutation: UPDATE_EMPLOYEE,
      variables: { eid, ...input },
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(map(res => res.data!.updateEmployee));
  }

  deleteEmployee(eid: string): Observable<string> {
    return this.apollo.mutate<{ deleteEmployee: string }>({
      mutation: DELETE_EMPLOYEE,
      variables: { eid },
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(map(res => res.data!.deleteEmployee));
  }
}
