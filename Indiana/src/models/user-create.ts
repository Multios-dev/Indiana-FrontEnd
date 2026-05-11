export interface ContactInput {
  email: string;  // Validé automatiquement par regex email
  phone: string;  // Format: +?[0-9]{8,15}
}

export interface AddressInput {
  box_number: string;  // Optionnel comme au backend
  thoroughfare: string;
  post_name: string;
  post_code: string;
  country: string;  // Format: ISO 3166-1 alpha-2 (e.g. 'BE', 'FR', 'NL')
}

export interface UserCreateInput {
  // Liste de prénoms (au moins 1 prénom)
  first_names: string[];
  last_name: string;
  birth_date: string | null;  // Format: YYYY-MM-DD
  gender: string;
  nationality: string[];
  totem: string;
  quali: string;
  is_legal_guardian: boolean;
  contact?: ContactInput | null;
  home_address: AddressInput;
  residential_address?: AddressInput | null;
}

export interface UserUpdateInput {
  first_names?: string[];
  last_name?: string;
  birth_date?: string;
  gender?: string;
  totem?: string;
  quali?: string;
  is_legal_guardian?: boolean;
  contact?: ContactInput | null;
}
