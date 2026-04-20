import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EventOutput } from '../../models/event-output';
import * as L from 'leaflet';

// Configuration correcte des icônes Leaflet
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Remplacer l'icône par défaut de Leaflet
L.Marker.prototype.options.icon = defaultIcon;

@Component({
  selector: 'app-event-map',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="event-map-wrapper">
      @if (hasValidLocation) {
        <div #mapContainer class="map-element"></div>
      } @else {
        <div class="no-location-message">
          📍 {{ 'NO_LOCATION' | translate }}
        </div>
      }
    </div>
  `,
  styles: [`
    .event-map-wrapper {
      position: relative;
      width: 100%;
      height: 300px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .map-element {
      width: 100%;
      height: 100%;
      display: block;
    }

    .no-location-message {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      color: #666;
      font-weight: 500;
      font-size: 14px;
    }
  `]
})
export class EventMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() event: EventOutput | null = null;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  hasValidLocation: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Vérifier si l'événement a des coordonnées valides
    this.hasValidLocation = !!(
      this.event?.latitude !== null && 
      this.event?.latitude !== undefined &&
      this.event?.longitude !== null && 
      this.event?.longitude !== undefined
    );
  }

  ngAfterViewInit(): void {
    if (this.hasValidLocation && this.event && this.mapContainer) {
      // Délai pour s'assurer que le DOM est complètement rendu
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }

  private initializeMap(): void {
    if (!this.event || !this.mapContainer?.nativeElement) {
      return;
    }

    const lat = this.event.latitude!;
    const lng = this.event.longitude!;

    try {
      // Créer la carte avec les bonnes options
      this.map = L.map(this.mapContainer.nativeElement, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Ajouter la couche OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1
      }).addTo(this.map);

      // Ajouter un marqueur pour l'événement avec l'icône correcte
      const marker = L.marker([lat, lng], { icon: defaultIcon })
        .addTo(this.map);

      // Ajouter un popup avec les infos de l'événement
      const popupContent = `
        <div class="event-popup" style="padding: 8px; font-family: sans-serif;">
          <strong style="display: block; margin-bottom: 4px;">${this.escapeHtml(this.event.name || 'Événement')}</strong>
          ${this.event.event_type ? `<span style="display: inline-block; background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 6px;">${this.escapeHtml(this.event.event_type)}</span><br>` : ''}
          ${this.event.address ? `<small style="color: #666;">${this.escapeHtml(this.event.address.post_name)}, ${this.event.address.post_code}</small>` : ''}
        </div>
      `;
      marker.bindPopup(popupContent);

      // Redimensionner la carte et la centrer
      if (this.map) {
        this.map.invalidateSize(false);
        this.map.setView([lat, lng], 15);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

