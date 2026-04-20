import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { UserLoginInput, UserLoginOutput } from '../models/user-login';
import { UserService } from './user.service';
import { UserOutput } from '../models/user-output';

interface JwtResponse {
  token: string;
}

@Injectable({ 
  providedIn: 'root',
 })

export class AuthService {
  private readonly tokenKey = 'jwt_token';
  private readonly userIdKey = 'user_id';
  private readonly loginEndpoint = environment.baseApi_url + '/auth/login';

  public loggedIn: WritableSignal<boolean> = signal(false);
  
  private http = inject(HttpClient);
  private userService = inject(UserService);

  /**
   * Login with email and password
   * Returns user ID from backend
   */
  public loginWithEmail(email: string, password: string): Observable<UserLoginOutput> {
    const credentials: UserLoginInput = { email, password };
    return this.http.post<UserLoginOutput>(this.loginEndpoint, credentials).pipe(
      tap((res) => {
        this.setUserId(res.id);
        this.loggedIn.set(true);
      })
    );
  }

  /**
   * TODO Call backend and store returned JWT in localStorage.
   * Replace '/api/login' by the real authentication endpoint.
   **/
  public login(username: string, password: string): Observable<void> {
    return this.http.post<JwtResponse>('/api/login', { username, password }).pipe(
      tap((res) => this.setToken(res.token)),
      map(() => void 0)
    );
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    this.loggedIn.set(false);
  }

  public getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns Observable contenant les informations de l'utilisateur
   */
  public getCurrentUserInfo(): Observable<UserOutput> {
    const userId = this.getUserId();
    if (!userId) {
      return of(null as any);
    }
    return this.userService.getCurrentUser(userId);
  }

  private setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }

  public getToken(): string | null {
    //for test
    return "heiheieh"
    //return localStorage.getItem(this.tokenKey);
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) {
      return false;
    }
    // exp is in seconds
    return payload.exp * 1000 > Date.now();
  }

  public getDecodedToken(): any {
    const token = this.getToken();
    return token ? this.parseToken(token) : null;
  }

  public getRoles(): string[] {
    const payload = this.getDecodedToken();
    return (payload && payload.roles) || [];
  }

  public setLoggedIn() {
    this.loggedIn.set(true);
    setTimeout(() => {
      this.loggedIn.set(false);
    }, 0);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private parseToken(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
