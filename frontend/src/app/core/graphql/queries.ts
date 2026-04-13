import { gql } from 'apollo-angular';

export const LOGIN_MUTATION = gql`
  query Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      _id
      username
      email
    }
  }
`;

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
      employee_photo
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query SearchEmployeeById($eid: ID!) {
    searchEmployeeById(eid: $eid) {
      _id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
      employee_photo
    }
  }
`;

export const SEARCH_EMPLOYEES = gql`
  query SearchEmployeeByDesignationOrDepartment($designation: String, $department: String) {
    searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
      _id
      first_name
      last_name
      email
      gender
      designation
      department
      salary
      date_of_joining
      employee_photo
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String
    $designation: String!
    $department: String!
    $salary: Float!
    $date_of_joining: String!
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      department: $department
      salary: $salary
      date_of_joining: $date_of_joining
      employee_photo: $employee_photo
    ) {
      _id
      first_name
      last_name
      email
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $eid: ID!
    $first_name: String
    $last_name: String
    $email: String
    $gender: String
    $designation: String
    $department: String
    $salary: Float
    $date_of_joining: String
    $employee_photo: String
  ) {
    updateEmployee(
      eid: $eid
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      department: $department
      salary: $salary
      date_of_joining: $date_of_joining
      employee_photo: $employee_photo
    ) {
      _id
      first_name
      last_name
      email
      designation
      department
      salary
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployee(eid: $eid)
  }
`;
