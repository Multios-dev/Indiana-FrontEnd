import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environment/environment';
import {Observable} from 'rxjs';
import {UserInfos} from '../models/user-info';
import {UserCreateInput, UserUpdateInput} from '../models/user-create';
import {UserOutput} from '../models/user-output';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  httpClient: HttpClient = inject(HttpClient);
  static readonly ENDPOINT_NAME: string = "users";
  static readonly ENDPOINT_URL: string = environment.baseApi_url + "/" + UserService.ENDPOINT_NAME;

  auth(username:String, password:String): Observable<UserInfos> {
    //TODO change the service
    return this.httpClient.post<UserInfos>(UserService.ENDPOINT_URL+ "/auth",{username,password});
  }

  /**
   * Crée un nouvel utilisateur avec les informations détaillées
   * @param userInput les données d'entrée pour la création d'utilisateur
   * @param password le mot de passe de l'utilisateur
   * @returns Observable contenant les informations de l'utilisateur créé
   */
  createUser(userInput: UserCreateInput, password: string): Observable<any> {
    const payload = { ...userInput, password };
    return this.httpClient.post<any>(UserService.ENDPOINT_URL, payload);
  }

  /**
   * Met à jour les informations d'un utilisateur existant
   * @param userId l'ID de l'utilisateur à mettre à jour
   * @param userInput les données d'entrée pour la mise à jour
   * @returns Observable contenant les informations de l'utilisateur mis à jour
   */
  updateUser(userId: string, userInput: UserUpdateInput): Observable<any> {
    return this.httpClient.put<any>(`${UserService.ENDPOINT_URL}/${userId}`, userInput);
  }

  /**
   * Récupère les informations d'un utilisateur par ID
   * @param userId l'ID de l'utilisateur
   * @returns Observable contenant les informations de l'utilisateur
   */
  getUserById(userId: string): Observable<any> {
    return this.httpClient.get<any>(`${UserService.ENDPOINT_URL}/${userId}`);
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   * @param userId l'ID de l'utilisateur connecté (depuis le localStorage)
   * @returns Observable contenant les informations de l'utilisateur
   */
  getCurrentUser(userId: string): Observable<UserOutput> {
    return this.getUserById(userId);
  }

  /**
   * Récupère les mineurs sous la responsabilité de l'utilisateur
   * @param userId l'ID de l'utilisateur connecté (depuis le localStorage)
   * @returns Observable contenant les informations des mineurs
   */
  getMinorsUsersById(userId: string): Observable<UserOutput[]> {
    return this.httpClient.get<UserOutput[]>(`${UserService.ENDPOINT_URL}/${userId}/minors`);
  }
}