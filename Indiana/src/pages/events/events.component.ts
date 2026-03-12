// events.component.ts
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
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {

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
      statusClass: 'status-open'
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
      statusClass: 'status-open'
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
      statusClass: 'status-open'
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
      statusClass: 'status-planned'
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
      statusClass: 'status-closed'
    }
  ];
}