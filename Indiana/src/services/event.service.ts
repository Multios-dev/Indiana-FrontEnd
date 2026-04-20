import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { EventOutput, EventsResponse } from '../models/event-output';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  httpClient: HttpClient = inject(HttpClient);
  static readonly ENDPOINT_NAME: string = "events";
  static readonly ENDPOINT_URL: string = environment.baseApi_url + "/" + EventService.ENDPOINT_NAME;

  /**
   * Récupère la liste des événements avec pagination
   * @param skip nombre d'événements à ignorer (par défaut 0)
   * @param limit nombre d'événements à retourner (par défaut 10)
   * @returns Observable contenant la réponse paginée des événements
   */
  getEvents(skip: number = 0, limit: number = 10): Observable<EventsResponse> {
    return this.httpClient.get<EventsResponse>(
      `${EventService.ENDPOINT_URL}?skip=${skip}&limit=${limit}`
    );
  }

  /**
   * Récupère les détails d'un événement par son ID
   * @param eventId l'ID de l'événement
   * @returns Observable contenant les détails de l'événement
   */
  getEventById(eventId: string): Observable<EventOutput> {
    return this.httpClient.get<EventOutput>(`${EventService.ENDPOINT_URL}/${eventId}`);
  }
}
