export interface Membership {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  price?: number | null;
}

export interface MembershipWithOrganization extends Membership {
  organization_name?: string;
}
