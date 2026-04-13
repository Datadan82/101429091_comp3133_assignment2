import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, map, tap, switchMap } from 'rxjs';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/queries';

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'emp_auth_token';
  private readonly USER_KEY  = 'emp_auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apollo: Apollo, private router: Router) {}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private saveSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  login(usernameOrEmail: string, password: string): Observable<AuthResponse> {
    return this.apollo.query<{ login: AuthResponse }>({
      query: LOGIN_MUTATION,
      variables: { usernameOrEmail, password },
      fetchPolicy: 'no-cache'
    }).pipe(
      map(res => {
        if (!res.data?.login) throw new Error('Invalid credentials');
        return res.data.login;
      }),
      tap(auth => this.saveSession(auth.token, auth.user))
    );
  }

  signup(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.apollo.mutate<{ signup: User }>({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password }
    }).pipe(
      map(res => {
        if (!res.data?.signup) throw new Error('Signup failed');
        return res.data.signup;
      }),
      switchMap(() => this.login(username, password))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.apollo.client.clearStore();
    this.router.navigateByUrl('/login');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
