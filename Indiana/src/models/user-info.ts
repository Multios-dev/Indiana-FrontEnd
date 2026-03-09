// need to change the informations for the application

export interface UserInfos {
  company_name: string;
  company_number: string;
  email: string;
  exp: number;
  family_name: string;
  given_name: string;
  kc_user_id: string;
  name: string;
  preferred_username: string;
  realm_access: RealmAccess;
  tenant_id: string;
}

export interface RealmAccess {
  roles: string[];
}