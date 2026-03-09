import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { KeyCloakAdmin } from '../models/keycloak/keycloak-admin';
//import { LoginForm } from '../shared/account/models/login-form';
import { KeycloakConnectionReturn, KeycloakConnectionReturnOtp } from '../models/keycloak/keycloak-connection-return';
import { KeyCloakLogin } from '../models/keycloak/keycloak-login';
import { KeyCloakUserGroup } from '../models/keycloak/keycloak-user-group';
import { TokenService } from './token.service';
import { KeyCloakUser } from '../models/keycloak/keycloak-user';
import { KeyCloakResetPassword } from '../models/keycloak/keycloak-reset-password';
import { KeyCloakRole } from '../models/keycloak/keycloak-role';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class KeyCloakService {
  private readonly _url = environment.baseKeyCloakUrl + 'users';

  private _storageService = inject(StorageService);
  private _tokenService = inject(TokenService);

  public assignedRole: WritableSignal<KeyCloakRole | null> = signal(null);
  public isOtp: WritableSignal<boolean> = signal(false);
  public isResetPassword: WritableSignal<boolean> = signal(false);
  public needResetUpdateEmailForm: WritableSignal<boolean> = signal(false);
  public needResetUpdatePasswordForm: WritableSignal<boolean> = signal(false);
  public removedRole: WritableSignal<KeyCloakRole | null> = signal(null);

  constructor(private http: HttpClient) { }

  //#region GROUP
  public getUsersByGroup(): Observable<KeyCloakUserGroup> {
    return this.http.get<KeyCloakUserGroup>(this._url + '/get_users_by_group');
  }
  //#endregion

  //#region LOGIN
  public createAdmin(keycloakAdmin: KeyCloakAdmin): Observable<boolean> {
    return this.http.post<boolean>(this._url + '/create_admin', keycloakAdmin);
  }

  public login(credentials: KeyCloakLogin): Observable<KeycloakConnectionReturnOtp> {
    return this.http.post<KeycloakConnectionReturnOtp>(this._url + '/login', credentials);
  }

//   public preLogin(credentials: LoginForm): Observable<KeycloakConnectionReturn> {
//     this._storageService.removeItem('token');
//     return this.http.post<KeycloakConnectionReturn>(this._url + '/pre_login', credentials);
//   }

  public requestResetPassword(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.post<boolean>(this._url + '/send_reset_password_request', {}, { params });
  }
  //#endregion

  //#region ROLES
  public addRole(role: string): Observable<boolean> {
    const params = new HttpParams().set('role_name', role);
    return this.http.post<boolean>(this._url + '/create_role', {}, { params });
  }

  public assignRoleToUser(roleId: string, userId: string): Observable<boolean> {
    const params = new HttpParams()
      .set('user_id', userId)
      .set('role_id', roleId);
    return this.http.post<boolean>(this._url + '/assign_user_role', {}, { params });
  }
  
  public getRoles(): Observable<KeyCloakRole[]> {
    return this.http.get<KeyCloakRole[]>(this._url + '/get_roles_by_group');
  }  

  public removeRoleToUser(roleId: string, userId: string): Observable<boolean> {
    const params = new HttpParams()
      .set('user_id', userId)
      .set('role_id', roleId);
    return this.http.delete<boolean>(this._url + '/remove_user_role', { params });
  }

  public switchGroup(userId: string): Observable<boolean> {
    const params = new HttpParams()
      .set('user_id', userId);
    return this.http.put<boolean>(this._url + '/switch_group', {}, { params });
  }
  //#endregion

  //#region USER
  public createUser(keycloakUser: KeyCloakUser, groupId: string): Observable<boolean> {
  const params = new HttpParams().set('group_id', groupId);

  return this.http.post<boolean>(
    this._url + '/create_user',
    keycloakUser,
    { params }
  );
}

  public deleteUser(id: string): Observable<boolean> {
    const params = new HttpParams().set('user_id', id);
    return this.http.delete<boolean>(this._url + '/delete_user', { params });
  }

  public resetPassword(keyCloakResetPassword: KeyCloakResetPassword): Observable<boolean> {
    return this.http.put<boolean>(this._url + '/update_password_connected_user', keyCloakResetPassword);
  }

  public updateEmail(userId: string, email: string): Observable<boolean> {
    const payload = { user_id: userId, new_email: email };
    return this.http.put<boolean>(this._url + '/update_email', payload);
  }
  //#endregion
}