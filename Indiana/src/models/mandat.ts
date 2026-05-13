/**
 * Mandat - représente une charge (rôle) d'un utilisateur au sein d'une unité
 */
export interface Mandat {
  id: string;
  role: string;
  unit: string;
  from: string;
  to: string;
  isActive: boolean;
}
