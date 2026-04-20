/**
 * Modèles pour les événements
 * Correspondent aux modèles Pydantic du backend
 */

export interface AudienceOutput {
  id: string;
  label?: string | null;
}

export interface AddressOutput {
  id: string;
  thoroughfare: string;
  box_number?: string | null;
  post_name: string;
  post_code: string;
  country: string;
}

export interface EventOutput {
  id: string;
  name: string;
  description?: string | null;
  event_type: string;
  start_date?: string | null;  // Format: ISO 8601 datetime
  end_date?: string | null;    // Format: ISO 8601 datetime
  latitude?: number | null;
  longitude?: number | null;
  parent_id?: string | null;
  audiences: AudienceOutput[];
  address?: AddressOutput | null;
}

export interface EventsResponse {
  items: EventOutput[];
  total: number;
  skip: number;
  limit: number;
}
