//TODO : dans les models, les "?" et null ne servent à rien pour les strings, à retirer

/**
 * Modèles pour les événements
 * Correspondent aux modèles Pydantic du backend
 */

export interface AudienceOutput {
  id: string;
  label: string;
}

export interface AddressOutput {
  id: string;
  thoroughfare: string;
  box_number: string;
  post_name: string;
  post_code: string;
  country: string;
}

export interface EventOutput {
  id: string;
  name: string;
  description: string;
  event_type: string;
  start_date: string;  // Format: ISO 8601 datetime
  end_date: string;    // Format: ISO 8601 datetime
  latitude: number;
  longitude: number;
  parent_id?: string | null;
  max_participants: number;
  audiences: AudienceOutput[];
  address?: AddressOutput | null;
}

export interface EventsResponse {
  items: EventOutput[];
  total: number;
  skip: number;
  limit: number;
}

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
