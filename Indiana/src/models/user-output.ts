export interface ContactOutput {
  id: string;
  email: string;
  phone?: string;
  website?: string;
}

export interface AddressOutput {
  id: string;
  thoroughfare: string;
  box_number?: string;
  post_name: string;
  post_code: string;
  country: string;
}

export interface UserOutput {
  id: string;
  first_names: string[];
  last_name: string;
  birth_date?: string;
  gender?: string;
  nationality: string[];
  totem?: string;
  quali?: string;
  is_legal_guardian: boolean;
  contact?: ContactOutput;
  home_address: AddressOutput;
  residential_address?: AddressOutput;
}
