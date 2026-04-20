/**
 * Modèles pour la création et la mise à jour d'utilisateur
 * Correspodent aux modèles Pydantic du backend
 */

export interface ContactInput {
  email?: string | null;  // Validé automatiquement par regex email
  phone?: string | null;  // Format: +?[0-9]{8,15}
}

export interface AddressInput {
  box_number?: string | null;  // Optionnel comme au backend
  thoroughfare: string;
  post_name: string;
  post_code: string;
  country: string;  // Format: ISO 3166-1 alpha-2 (e.g. 'BE', 'FR', 'NL')
}

export interface UserCreateInput {
  // Liste de prénoms (au moins 1 prénom)
  first_names: string[];
  last_name?: string | null;
  birth_date?: string | null;  // Format: YYYY-MM-DD
  gender?: string | null;
  nationality: string[];
  totem?: string | null;
  quali?: string | null;
  is_legal_guardian?: boolean;
  contact?: ContactInput | null;
  home_address: AddressInput;
  residential_address?: AddressInput | null;
}

export interface UserUpdateInput {
  first_names?: string[] | null;
  last_name?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  totem?: string | null;
  quali?: string | null;
  is_legal_guardian?: boolean | null;
  contact?: ContactInput | null;
}
