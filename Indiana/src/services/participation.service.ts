import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ParticipationOutput } from '../models/participation-output';
import { CreateParticipationInput, ParticipationInvitationInput } from '../models/participation-input';

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {
  httpClient: HttpClient = inject(HttpClient);
  static readonly ENDPOINT_NAME: string = "participations";
  static readonly ENDPOINT_URL: string = environment.baseApi_url + "/" + ParticipationService.ENDPOINT_NAME;

  /**
   * Crée une participation (préinscription) à un événement
   * @param payload les données de préinscription
   * @returns Observable contenant la participation créée
   */
  public createParticipation(payload: CreateParticipationInput): Observable<ParticipationOutput> {
    return this.httpClient.post<ParticipationOutput>(ParticipationService.ENDPOINT_URL, payload);
  }

  /**
   * Invite un utilisateur à un événement
   * @param payload les données d'invitation
   * @returns Observable contenant le résultat de l'invitation
   */
  public inviteToEvent(payload: ParticipationInvitationInput): Observable<any> {
    return this.httpClient.post<any>(`${ParticipationService.ENDPOINT_URL}/invite`, payload);
  }

  /**
   * Récupère toutes les participations
   * @param filters filtres optionnels
   * @returns Observable contenant la liste des participations
   */
  public getAllParticipations(filters?: any): Observable<ParticipationOutput[]> {
    return this.httpClient.get<ParticipationOutput[]>(ParticipationService.ENDPOINT_URL, { params: filters });
  }

  /**
   * Vérifie si un utilisateur est participant à un événement
   * @param userId l'ID de l'utilisateur
   * @param eventId l'ID de l'événement
   * @returns Observable contenant un tableau de participations ou null en cas d'erreur
   */
  public getParticipationByUserAndEvent(userId: string, eventId: string): Observable<ParticipationOutput[] | null> {
    // Utiliser les query params pour filtrer
    let params = new HttpParams();
    params = params.set('user_id', userId);
    params = params.set('event_id', eventId);
    
    return this.httpClient.get<ParticipationOutput[]>(ParticipationService.ENDPOINT_URL, { params })
      .pipe(
        catchError(() => of(null))  // En cas d'erreur (404, etc.), retourner null
      );
  }

  /**
   * Récupère une participation par son ID
   * @param participationId l'ID de la participation
   * @returns Observable contenant la participation
   */
  public getParticipationById(participationId: string): Observable<ParticipationOutput> {
    return this.httpClient.get<ParticipationOutput>(`${ParticipationService.ENDPOINT_URL}/${participationId}`);
  }

  /**
   * Supprime une participation
   * @param participationId l'ID de la participation à supprimer
   * @returns Observable contenant le résultat
   */
  public deleteParticipation(participationId: string): Observable<any> {
    return this.httpClient.delete<any>(`${ParticipationService.ENDPOINT_URL}/${participationId}`);
  }
}
