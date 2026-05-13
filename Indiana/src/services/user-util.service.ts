import { Injectable } from '@angular/core';
import { UserOutput } from '../models/user-output';

@Injectable({
  providedIn: 'root'
})
export class UserUtilService {
  /**
   * Surcharge 1: À partir d'un objet UserOutput
   */
  public getInitials(user: UserOutput): string;
  /**
   * Surcharge 2: from first names and last name 
   */
  public getInitials(firstNames: string, lastName: string): string;
  /**
   * Implementation of getInitials
   */
  public getInitials(userOrFirstNames: UserOutput | string | null, lastName?: string): string {
    // Vérifier si userOrFirstNames est null ou undefined
    if (!userOrFirstNames) {
      return '';
    }
    
    if (typeof userOrFirstNames === 'string') {
      // Surcharge 2: firstNames and lastName as chains
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
