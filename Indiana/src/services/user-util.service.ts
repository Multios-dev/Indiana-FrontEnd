import { Injectable } from '@angular/core';
import { UserOutput } from '../models/user-output';

@Injectable({
  providedIn: 'root'
})
export class UserUtilService {
  /**
   * Génère les initiales d'un utilisateur
   * Surcharge 1: À partir d'un objet UserOutput
   */
  public getInitials(user: UserOutput): string;
  /**
   * Génère les initiales d'un utilisateur
   * Surcharge 2: À partir de prénoms et nom de famille (chaînes)
   */
  public getInitials(firstNames: string, lastName: string): string;
  /**
   * Implémentation de getInitials
   */
  public getInitials(userOrFirstNames: UserOutput | string, lastName?: string): string {
    if (typeof userOrFirstNames === 'string') {
      // Surcharge 2: firstNames et lastName comme chaînes
      const names = userOrFirstNames?.split(',')?.[0]?.trim() || '';
      const firstChar = names?.[0]?.toUpperCase() || '';
      const lastChar = lastName?.[0]?.toUpperCase() || '';
      return `${firstChar}${lastChar}`;
    } else {
      // Surcharge 1: UserOutput
      const firstChar = userOrFirstNames.first_names?.[0]?.[0]?.toUpperCase() || '';
      const lastChar = userOrFirstNames.last_name?.[0]?.toUpperCase() || '';
      return `${firstChar}${lastChar}`;
    }
  }
}
