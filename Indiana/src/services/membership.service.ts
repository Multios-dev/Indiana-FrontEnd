import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { Membership } from '../models/membership';

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly ENDPOINT_URL = environment.baseApi_url + '/memberships';

  /**
   * Récupère les memberships (mandats) d'un utilisateur spécifique
   * @param userId ID de l'utilisateur
   * @param skip nombre de résultats à ignorer (optionnel)
   * @param limit nombre de résultats à retourner (optionnel)
   * @returns Observable contenant la liste des memberships
   */
  getMembershipsByUserId(userId: string, skip?: number, limit?: number): Observable<Membership[] | any> {
    let params = new HttpParams();
    params = params.set('user_id', userId);
    
    // N'ajouter skip et limit que s'ils sont fournis
    if (skip !== undefined && skip !== null) {
      params = params.set('skip', skip.toString());
    }
    if (limit !== undefined && limit !== null) {
      params = params.set('limit', limit.toString());
    }

    console.log('🔧 MembershipService - URL:', `${this.ENDPOINT_URL}?${params.toString()}`);
    return this.httpClient.get<Membership[]>(this.ENDPOINT_URL, { params });
  }

  /**
   * Récupère les détails d'un membership par son ID
   * @param membershipId ID du membership
   * @returns Observable contenant les détails du membership
   */
  getMembershipById(membershipId: string): Observable<Membership> {
    return this.httpClient.get<Membership>(`${this.ENDPOINT_URL}/${membershipId}`);
  }

  /**
   * Crée un nouveau membership
   * @param membership Données du membership à créer
   * @returns Observable contenant le membership créé
   */
  createMembership(membership: Omit<Membership, 'id'>): Observable<Membership> {
    return this.httpClient.post<Membership>(this.ENDPOINT_URL, membership);
  }

  /**
   * Met à jour un membership
   * @param membershipId ID du membership à mettre à jour
   * @param membership Données du membership à mettre à jour
   * @returns Observable contenant le membership mis à jour
   */
  updateMembership(membershipId: string, membership: Partial<Membership>): Observable<Membership> {
    return this.httpClient.put<Membership>(`${this.ENDPOINT_URL}/${membershipId}`, membership);
  }

  /**
   * Supprime un membership
   * @param membershipId ID du membership à supprimer
   * @returns Observable
   */
  deleteMembership(membershipId: string): Observable<any> {
    return this.httpClient.delete(`${this.ENDPOINT_URL}/${membershipId}`);
  }
}
