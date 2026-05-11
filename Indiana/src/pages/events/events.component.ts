import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EventService } from '../../services/event.service';
import { ParticipationService } from '../../services/participation.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { EventOutput, ScoutEvent } from '../../models/event-output';
import { EventMapComponent } from '../../shared/event-map/event-map.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, TranslateModule, EventMapComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  selectedEvent: ScoutEvent | null = null;
  selectedEventOutput: EventOutput | null = null;  // Stocker les données brutes pour la carte
  events: ScoutEvent[] = [];
  eventsOutput: EventOutput[] = [];  // Stocker les EventOutput bruts
  isLoading = false;
  isSubmittingParticipation = false;
  isUserParticipating = false;  // Indique si l'utilisateur est déjà inscrit
  isLoadingParticipation = false;  // État de chargement de la vérification de participation

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  totalEvents: number = 0;

  private eventService = inject(EventService);
  private participationService = inject(ParticipationService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // D'abord récupérer le nombre total d'événements
    this.loadTotalCount();
  }

  private loadTotalCount(): void {
    // Récupérer le nombre total d'événements
    this.eventService.getEventsCount().subscribe({
      next: (total: number) => {
        this.totalEvents = total;
        // Ensuite charger les événements paginés
        this.loadEvents();
      }
    });
  }

  private loadEvents(): void {
    this.isLoading = true;
    const offset = (this.currentPage - 1) * this.pageSize;
    const limit = this.pageSize;

    this.eventService.getEvents(offset, limit).subscribe({
      //TODO: pourquoi ":any" ? on devrait pouvoir typer la réponse du backend en EventsResponse, à corriger
      next: (response: any) => {
        
        this.eventsOutput = response;  // Stocker les données brutes
        this.loadParticipantsCounts(this.eventsOutput);
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  //TODO demander au backend de retourner directement le nombre de participants dans la réponse des événements
  // pour éviter d'avoir à faire une requête par événement, à corriger dès que possible
private loadParticipantsCounts(events: EventOutput[]): void {
  const requests = events.map(event =>
    this.eventService.getEventsParticipantsCount(event.id).pipe(
    )
  );

  forkJoin(requests).subscribe((counts) => {
    this.events = events.map((event, index) => {
      const scoutEvent = this.mapEventOutputToScoutEvent(event);
      scoutEvent.registered = Number(counts[index]);
      return scoutEvent;
    });

    this.isLoading = false;
    this.cdr.detectChanges();
  });
}

  private mapEventOutputToScoutEvent(event: EventOutput): ScoutEvent {
    // Déterminer le type et la classe associée
    const eventType = event.event_type || 'Événement';
    let typeClass = 'badge-default';
    //TODO: passer par une énumération pour les types d'événements et les classes associées
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
    //TODO pour les labels passer par i18n
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
      //TODO: remap non nécessaire puisque déjà mapper, juste compléter les infos manquantes
      name: event.name || 'Sans titre', //dans le html 
      type: eventType,
      typeClass: typeClass,
      dateStart: event.start_date ? event.start_date.split('T')[0] : '',
      dateEnd: event.end_date ? event.end_date.split('T')[0] : undefined,
      location: location,
      registered: 0,  // Valeur par défaut, sera mise à jour après la récupération du nombre de participants
      capacity: event.max_participants,    
      statusLabel: statusLabel,
      statusClass: statusClass,
      description: event.description || 'Pas de description disponible'
    };
  }

  public selectEvent(event: ScoutEvent, index: number): void {
    this.selectedEvent = event;
    this.selectedEventOutput = this.eventsOutput[index] || null;  // Récupérer les données brutes correspondantes
    this.isUserParticipating = false;
    this.loadUserParticipationStatus();
  }

  private loadUserParticipationStatus(): void {
    const userId = this.authService.getUserId();
    
    // Si pas connecté, on peut pas vérifier la participation
    if (!userId || !this.selectedEventOutput?.id) {
      this.isUserParticipating = false;
      return;
    }

    this.isLoadingParticipation = true;
    //TODO: vérifier si on a les droits de voir les participants
    //Sinon inutile de les charger

    //Si on n'est pas super-admin, juste faire un call pour vérifier si on en fait parti ou pas
    this.participationService.getParticipationByUserAndEvent(userId, this.selectedEventOutput.id).subscribe({
      next: (result) => {
        // result peut être null ou un tableau de participations
        this.isUserParticipating = result !== null && (Array.isArray(result) ? result.length > 0 : false);
        this.isLoadingParticipation = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Traiter toute erreur comme "pas de participation"
        this.isUserParticipating = false;
        this.isLoadingParticipation = false;
        this.cdr.detectChanges();
      }
    });
  }

  public closeDetail(): void {
    this.selectedEvent = null;
  }

  public editEvent(event: ScoutEvent): void {
    // TODO: Rediriger vers une page d'édition ou ouvrir un modal d'édition
  }

  public registerEvent(event: ScoutEvent): void {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      this.toastService.showToast(
        'participationToast',
        'Vous devez être connecté pour vous inscrire à un événement',
        'error',
        'Erreur'
      );
      return;
    }

    if (!this.selectedEventOutput?.id) {
      this.toastService.showToast(
        'participationToast',
        'Impossible de récupérer l\'ID de l\'événement',
        'error',
        'Erreur'
      );
      return;
    }

    this.isSubmittingParticipation = true;

    const payload = {
      user_id: userId,
      event_id: this.selectedEventOutput.id,
      role: 'inscribed',
      price: undefined
    };

    this.participationService.createParticipation(payload).subscribe({
      next: (result) => {
        this.isSubmittingParticipation = false;
        this.isUserParticipating = true;  // Mettre à jour immédiatement le statut
        this.toastService.showToast(
          'participationToast',
          'Vous êtes maintenant inscrit à l\'événement',
          'success',
          'Succès'
        );
        // Recharger les événements pour mettre à jour les compteurs après 1 seconde
        setTimeout(() => {
          this.refreshEvents();
        }, 1000);
      },
      error: (err) => {
        this.isSubmittingParticipation = false;
        this.cdr.detectChanges();
        let errorMessage = 'Une erreur est survenue lors de l\'inscription';
        
        // Gérer les erreurs spécifiques du backend
        if (err.status === 409) {
          errorMessage = 'Vous êtes déjà inscrit à cet événement';
          this.isUserParticipating = true;  // Mettre à jour le statut si déjà inscrit
        } else if (err.status === 404) {
          errorMessage = 'L\'événement n\'existe pas';
        } else if (err.error?.detail) {
          errorMessage = err.error.detail;
        }

        this.toastService.showToast(
          'participationToast',
          errorMessage,
          'error',
          'Erreur'
        );
        this.cdr.detectChanges();
      }
    });
  }

  public exportIcs(event: ScoutEvent): void {
    // TODO: Générer et télécharger un fichier .ics
  }

  public changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadEvents();
  }

  public refreshEvents(): void {
    this.loadEvents();
  }

  public nextPage(): void {
    this.currentPage++;
    this.loadEvents();
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEvents();
    }
  }

  public get totalPages(): number {
    return Math.ceil(this.totalEvents / this.pageSize);
  }
}