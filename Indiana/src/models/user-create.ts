export interface ContactInput {
  email: string;  // Validated automatically by email regex
  phone: string;  // Format: +?[0-9]{8,15}
}

export interface AddressInput {
  box_number: string;
  thoroughfare: string;
  post_name: string;
  post_code: string;
  country: string;  // Format: ISO 3166-1 alpha-2 (e.g. 'BE', 'FR', 'NL')
}

export interface UserCreateInput {
  // List of first names (at least 1 name)
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
