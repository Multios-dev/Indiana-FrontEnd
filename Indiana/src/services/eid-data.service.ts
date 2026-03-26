import { Injectable } from '@angular/core';

export interface EidData {
  lastName:    string;
  firstNames:  string[];   // peut contenir plusieurs prénoms
  birthDate:   string;     // format ISO DD-MM-yyyy
  gender:      'M' | 'F' | 'X' | '';
  nationality: string;
  street:      string;
  streetNumber: string;
  zip:         string;
  city:        string;
  /** Numéro de Registre National (optionnel, stocké mais non affiché dans le form) */
  nationalNumber?: string;
}

/**
 * Service léger (providedIn: 'root') qui sert de pont entre
 * RegisterEidComponent (lecture carte) et RegisterManualComponent (form).
 *
 * Cycle de vie :
 *   1. RegisterEidComponent lit la carte → appelle setData()
 *   2. RegisterEidComponent navigue vers /inscription/manuel
 *   3. RegisterManualComponent lit getData() dans son constructeur → pré-remplit le form
 *   4. RegisterManualComponent appelle clear() à la soumission (ou à la destruction)
 */
@Injectable({ providedIn: 'root' })
export class EidDataService {
  private _data: EidData | null = null;

  setData(data: EidData): void {
    this._data = data;
  }

  getData(): EidData | null {
    return this._data;
  }

  hasData(): boolean {
    return this._data !== null;
  }

  clear(): void {
    this._data = null;
  }
}
