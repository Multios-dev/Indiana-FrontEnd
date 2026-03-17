import { Injectable, inject } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { UserInfos } from '../models/user-info';
//import { ExternalInfos } from '../models/external-infos';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private _storageService = inject(StorageService);

  constructor() {}

  // Check si le token est présent dans le local storage.
  public get isTokenExist() {
    return this._storageService.getItem('token') != undefined;
  }

  // BehaviorSubject privée avec comme valeur de départ la présence du token dans le local storage.
  private _$token: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.isTokenExist
  );
  // Même qu'au dessus mais acsessible partout.
  $token = this._$token.asObservable();

  // Méthode pour indiquer à l'observable la présence ou le retrait du token dans le local storage.
  emitTokenExist() {
    this._$token.next(this.isTokenExist);
  }

  // Méthode qui va rechercher les informations de l'utilisateur dans le token
  decodeToken(): UserInfos {
    let token: string = this._storageService.getItem('token') ?? '';
    let jwt: any;
    if (token !== '') {
      jwt = jwt_decode.jwtDecode(token);
    }

    // Pour les test ['Module_Dati', 'Module_Easy_Report', 'Module_Dashboard']
    return {
      company_name: jwt.company_name,
      company_number: jwt.company_name,
      email: jwt.email,
      exp: jwt.exp,
      family_name: jwt.family_name,
      given_name: jwt.given_name,
      kc_user_id: jwt.kc_user_id,
      name: jwt.name,
      preferred_username: jwt.preferred_username,
      realm_access: jwt.realm_access,
      tenant_id: jwt.tenant_id,
    };
  }

//   public getAccessKeys(token: string): ExternalInfos | null {
//     let jwt: any;

//     if (token === '') {
//       return null;
//     }

//     jwt = jwt_decode.jwtDecode(token);
//     return {
//       apiAccessToken: jwt.ApiKey,
//       bookId: jwt.BookId,
//       googleAccessToken: jwt.GoogleToken,
//     };
//   }

  // Récupère les rôles.
  public get role() {
    return this.decodeToken().realm_access.roles;
  }

  // Check si le rôle est présent dans le tableau de rôles
  public hasModuleRole(role: string): boolean {
    return this.role.includes(role);
  }

  // Check si le token est encore valide
  // Pour tester -> * 1000 - 2000000
  public isTokenValid(): boolean {
    let tokenLimitDate = new Date(this.decodeToken().exp * 1000);
    let now = new Date();
    return tokenLimitDate > now;
  }

  // Check si le token va expirer
  // Pour tester -> * 1000 - 1900000
  public tokenWillExpires(): boolean {
    let tokenLimitDate = new Date(this.decodeToken().exp * 1000);
    let expiressSoonDate = new Date(this.decodeToken().exp * 1000 - 600000);
    let now = new Date();
    return now > expiressSoonDate && now < tokenLimitDate;
  }
}
