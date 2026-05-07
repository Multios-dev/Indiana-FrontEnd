export interface ParticipationInvitationInput {
  user_id: string;
  event_id: string;
  role?: string;
  price?: number;
}

export interface CreateParticipationInput {
  user_id: string;
  event_id: string;
  role?: string;
  price?: number;
}

export interface ParticipationUpdateInput {
  user_id?: string;
  event_id?: string;
  role?: string;
  price?: number;
}
