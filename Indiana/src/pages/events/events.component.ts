import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
export class EventsComponent {
  selectedEvent: ScoutEvent | null = null;

  // TODO: remplacer par un appel API réel
  events: ScoutEvent[] = [
    {
      name: 'Formation Animateur T1',
      type: 'Formation',
      typeClass: 'badge-formation',
      dateStart: '2026-03-15',
      dateEnd: '2026-03-16',
      location: 'Centre scout de Bruxelles',
      registered: 18,
      capacity: 25,
      statusLabel: 'Inscriptions ouvertes',
      statusClass: 'status-open',
      description: 'Formation de base pour les futurs animateurs. Apprentissage des techniques d\'animation, de la gestion de groupe et de la sécurité en camp.'
    },
    {
      name: 'Camp de Pâques',
      type: 'Camp',
      typeClass: 'badge-camp',
      dateStart: '2026-04-06',
      dateEnd: '2026-04-12',
      location: 'Domaine de Mozet',
      registered: 32,
      capacity: 40,
      statusLabel: 'Inscriptions ouvertes',
      statusClass: 'status-open',
      description: 'Une semaine festive en pleine nature pour toutes les tranches d\'âge. Au programme : activités, jeux de camp, veillées et moments conviviaux.'
    },
    {
      name: 'Journée sportive inter-unités',
      type: 'Activité',
      typeClass: 'badge-activite',
      dateStart: '2026-05-10',
      location: 'Parc du Cinquantenaire',
      registered: 45,
      capacity: 100,
      statusLabel: 'Inscriptions ouvertes',
      statusClass: 'status-open',
      description: 'Journée de compétitions sportives amicales entre les différentes unités. Venez supporter votre unité et profiter d\'une belle journée en équipe.'
    },
    {
      name: 'Assemblée Générale 2026',
      type: 'Réunion',
      typeClass: 'badge-reunion',
      dateStart: '2026-06-20',
      location: 'Maison des Scouts, Bruxelles',
      registered: 0,
      capacity: 60,
      statusLabel: 'Planifié',
      statusClass: 'status-planned',
      description: 'Assemblée générale annuelle pour discuter des orientations du mouvement, élire les responsables et présenter les projets futurs.'
    },
    {
      name: 'Formation premiers secours',
      type: 'Formation',
      typeClass: 'badge-formation',
      dateStart: '2026-02-01',
      dateEnd: '2026-02-02',
      location: 'Croix-Rouge de Belgique',
      registered: 20,
      capacity: 20,
      statusLabel: 'Inscriptions fermées',
      statusClass: 'status-closed',
      description: 'Certification de premiers secours agréée par la Croix-Rouge. Formation complète couvrant réanimation, plaies, fractures et autres urgences.'
    }
  ];

  selectEvent(event: ScoutEvent): void {
    this.selectedEvent = event;
  }

  closeDetail(): void {
    this.selectedEvent = null;
  }

  editEvent(event: ScoutEvent): void {
    // TODO: Rediriger vers une page d'édition ou ouvrir un modal d'édition
  }

  registerEvent(event: ScoutEvent): void {
    // TODO: Appel API pour s'inscrire à l'événement
  }

  exportIcs(event: ScoutEvent): void {
    // TODO: Générer et télécharger un fichier .ics
  }
}