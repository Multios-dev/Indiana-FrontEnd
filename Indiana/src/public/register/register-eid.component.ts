import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { EidDataService, EidData } from '../../services/eid-data.service';

/** États possibles du composant */
type EidStep = 'idle' | 'reading' | 'success' | 'error';

@Component({
  selector: 'app-register-eid',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslatePipe],
  templateUrl: './register-eid.component.html',
  styleUrls: ['./register-eid.component.scss'],
})
export class RegisterEidComponent {
  public step = signal<EidStep>('idle');
  public errorKey = signal<string>('REGISTER.EID.ERROR_GENERIC');

  private _router   = inject(Router);
  private _eidData  = inject(EidDataService);

  /**
   * Déclenché par le bouton "Lire ma carte eID".
   *
   * ─ Intégration réelle ─────────────────────────────────────────────
   * Remplacez le bloc `setTimeout` par votre appel au middleware eID
   * (ex. be.bosa.eid.client ou un backend proxy) :
   *
   *   const raw = await this._eidService.read();          // votre service
   *   this._eidData.setData(this._mapToEidData(raw));
   *   this.step.set('success');
   *
   * ─ Champs lus sur la carte ────────────────────────────────────────
   *  lastName, firstNames[], birthDate (YYYY-MM-DD), gender (M/F/X),
   *  nationality, street, zip, city, nationalNumber
   * ─────────────────────────────────────────────────────────────────
   */
  public async readCard(): Promise<void> {
    this.step.set('reading');

    try {
      // ── TODO: remplacer par le vrai appel eID ──────────────────
      const mockData: EidData = await this._mockReadCard();
      // ──────────────────────────────────────────────────────────

      this._eidData.setData(mockData);
      this.step.set('success');

      // Courte pause pour que l'utilisateur voit la confirmation
      setTimeout(() => this._router.navigate(['/inscription/manuel']), 1200);

    } catch (err: unknown) {
      console.error('[RegisterEidComponent] Erreur lecture carte :', err);
      this.errorKey.set(this._resolveErrorKey(err));
      this.step.set('error');
    }
  }

  /** Retry après une erreur */
  public retry(): void {
    this.step.set('idle');
  }

  // ── Helpers privés ────────────────────────────────────────────────

  /**
   * Simule une lecture eID (à supprimer en production).
   * Retourne une promesse résolue après 2 s avec des données fictives.
   */
  private _mockReadCard(): Promise<EidData> {
    return new Promise((resolve) =>
      setTimeout(() =>
        resolve({
          lastName:      'Dupont',
          firstNames:    ['Marie', 'Anne'],
          birthDate:     '1990-06-15',
          gender:        'F',
          nationality:   'Belge',
          street:        'Rue de la Loi 16',
          zip:           '1000',
          city:          'Bruxelles',
          nationalNumber: '90061500123',
        }),
        2000
      )
    );
  }

  /** Traduit une erreur technique en clé i18n */
  private _resolveErrorKey(err: unknown): string {
    if (err instanceof Error) {
      if (err.message.includes('NO_CARD'))       return 'REGISTER.EID.ERROR_NO_CARD';
      if (err.message.includes('CANCELLED'))     return 'REGISTER.EID.ERROR_CANCELLED';
      if (err.message.includes('PIN'))           return 'REGISTER.EID.ERROR_PIN';
    }
    return 'REGISTER.EID.ERROR_GENERIC';
  }
}
