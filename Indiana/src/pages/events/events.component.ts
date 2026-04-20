import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EventService } from '../../services/event.service';
import { EventOutput } from '../../models/event-output';

export interface ScoutEvent {
  name: string;
  type: string;
  typeClass: string;
  dateStart: string;
  dateEnd?: string;
  location: string;
  registered: number;
  capacity: number;
  statusLabel: string;
  statusClass: string;
  description: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  selectedEvent: ScoutEvent | null = null;
  events: ScoutEvent[] = [];
  isLoading = false;

  private eventService = inject(EventService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents(0, 10).subscribe({
      next: (response: any) => {
        // Gérer les deux cas : tableau direct ou objet avec items
        let events: EventOutput[] = [];
        if (Array.isArray(response)) {
          events = response;
        } else if (response && response.items && Array.isArray(response.items)) {
          events = response.items;
        } else if (response && response.data && Array.isArray(response.data)) {
          events = response.data;
        }
        
        this.events = events.map(event => this.mapEventOutputToScoutEvent(event));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        // TODO: afficher un message d'erreur à l'utilisateur
      }
    });
  }

  private mapEventOutputToScoutEvent(event: EventOutput): ScoutEvent {
    // Déterminer le type et la classe associée
    const eventType = event.event_type || 'Événement';
    let typeClass = 'badge-default';
    switch (eventType.toLowerCase()) {
      case 'formation':
        typeClass = 'badge-formation';
        break;
      case 'camp':
        typeClass = 'badge-camp';
        break;
      case 'activité':
      case 'activite':
        typeClass = 'badge-activite';
        break;
      case 'réunion':
      case 'reunion':
        typeClass = 'badge-reunion';
        break;
    }

    // Déterminer le statut (simplifié - à adapter selon la logique métier)
    const now = new Date();
    const startDate = event.start_date ? new Date(event.start_date) : null;
    let statusLabel = 'Planifié';
    let statusClass = 'status-planned';

    if (startDate && startDate < now) {
      statusLabel = 'Passé';
      statusClass = 'status-closed';
    } else {
      statusLabel = 'Inscriptions ouvertes';
      statusClass = 'status-open';
    }

    // Localisation (si adresse disponible, sinon "Localisation non disponible")
    let location = 'Localisation non disponible';
    if (event.address && event.address.thoroughfare) {
      location = `${event.address.thoroughfare}${event.address.box_number ? ', ' + event.address.box_number : ''}, ${event.address.post_code} ${event.address.post_name}`;
    }

    return {
      name: event.name || 'Sans titre',
      type: eventType,
      typeClass: typeClass,
      dateStart: event.start_date ? event.start_date.split('T')[0] : '',
      dateEnd: event.end_date ? event.end_date.split('T')[0] : undefined,
      location: location,
      registered: 0,  // Le backend ne retourne pas ce champ pour l'instant
      capacity: 0,    // Le backend ne retourne pas ce champ pour l'instant
      statusLabel: statusLabel,
      statusClass: statusClass,
      description: event.description || 'Pas de description disponible'
    };
  }

  public selectEvent(event: ScoutEvent): void {
    this.selectedEvent = event;
  }

  public closeDetail(): void {
    this.selectedEvent = null;
  }

  public editEvent(event: ScoutEvent): void {
    // TODO: Rediriger vers une page d'édition ou ouvrir un modal d'édition
  }

  public registerEvent(event: ScoutEvent): void {
    // TODO: Appel API pour s'inscrire à l'événement
  }

  public exportIcs(event: ScoutEvent): void {
    // TODO: Générer et télécharger un fichier .ics
  }
}