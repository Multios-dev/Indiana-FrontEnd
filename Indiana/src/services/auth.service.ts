import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { UserLoginInput, UserLoginOutput } from '../models/user-login';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { UserOutput } from '../models/user-output';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userIdKey = 'user_id';
  private readonly loginEndpoint = environment.baseApi_url + '/auth/login';

  public loggedIn: WritableSignal<boolean> = signal(false);

  private http = inject(HttpClient);
  private userService = inject(UserService);
  private storageService = inject(StorageService);

  constructor() {
    this.loggedIn.set(this.isLoggedIn());
  }

  /**
   * Stocke le token Keycloak après login OTP réussi.
   */
  public loginWithKeycloak(accessToken: string): void {
  this.storageService.setItem('token', accessToken);
  
  // Extraire le kc_user_id du token JWT et le stocker
  const payload = this.parseToken(accessToken);
  if (payload?.kc_user_id) {
    localStorage.setItem(this.userIdKey, payload.kc_user_id);
  }
  
  this.loggedIn.set(true);
}

  public loginWithEmail(email: string, password: string): Observable<UserLoginOutput> {
    const credentials: UserLoginInput = { email, password };
    return this.http.post<UserLoginOutput>(this.loginEndpoint, credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.userIdKey, res.id);
        this.loggedIn.set(true);
      })
    );
  }

  public logout(): void {
    this.storageService.removeItem('token');
    localStorage.removeItem(this.userIdKey);
    this.loggedIn.set(false);
  }

  //TODO vérifier si il renvoie une chaîne vide ou null et adapter le type de retour
  public getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  public getCurrentUserInfo(): Observable<UserOutput> {
    const userId = this.getUserId();
    if (!userId) {
      return of(null as any);
    }
    return this.userService.getCurrentUser(userId);
  }

  /**
   * Retourne le token JWT Keycloak s'il existe,
   * sinon un token de service fixe pour les routes backend publiques.
   * TODO: remplacer 'public_token' par le vrai token de service fourni par le backend.
   */
  public getToken(): string | null {
    return this.storageService.getItem('token') ?? 'heiheieh';
  }

  public isLoggedIn(): boolean {
    const token = this.storageService.getItem('token');
    if (!token) return false;
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  }

  public getDecodedToken(): any {
    const token = this.storageService.getItem('token');
    return token ? this.parseToken(token) : null;
  }

  public getRoles(): string[] {
    const payload = this.getDecodedToken();
    return (payload && payload.realm_access?.roles) || [];
  }

  private parseToken(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}