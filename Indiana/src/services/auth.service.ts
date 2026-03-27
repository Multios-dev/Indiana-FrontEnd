import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

interface JwtResponse {
  token: string;
}

@Injectable({ 
  providedIn: 'root',
 })

export class AuthService {
  private readonly tokenKey = 'jwt_token';

  public loggedIn: WritableSignal<boolean> = signal(false);
  
  constructor(private http: HttpClient) {}

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
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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
