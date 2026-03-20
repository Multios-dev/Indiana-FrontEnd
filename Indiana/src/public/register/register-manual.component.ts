import { Component, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EidDataService } from '../../services/eid-data.service';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';



@Component({
  selector: 'app-register-manual',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslatePipe,
    NgxSpinnerModule,
  ],
  templateUrl: './register-manual.component.html',
  styleUrls: ['./register-manual.component.scss'],
})
export class RegisterManualComponent implements OnDestroy {
  public accountCreated = false;
  public form: FormGroup;

  /** Indique que le formulaire a été pré-rempli via eID */
  public readonly prefilledFromEid: boolean;

  /** Ensemble des noms de contrôles pré-remplis (pour les badges visuels) */
  public readonly eidPrefilled = new Set<string>();

  private _loading = inject(NgxSpinnerService);
  private _eidData = inject(EidDataService);

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    // ── Initialisation du formulaire vide ──────────────────────────
    this.form = this.fb.group({
      lastName:    ['', Validators.required],
      firstNames:  this.fb.array([
        this.fb.control('', Validators.required),
      ]),
      birthDate:   ['', Validators.required],
      gender:      ['', Validators.required],
      nationality: ['', Validators.required],
      street:      ['', Validators.required],
      zip:         ['', Validators.required],
      city:        ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      phone:       [''],
      password:    ['', Validators.required],
    });

    // ── Pré-remplissage depuis eID si des données sont disponibles ─
    const eid = this._eidData.getData();
    if (eid) {
      this.prefilledFromEid = true;

      // Champs scalaires
      const scalarMap: Record<string, string> = {
        lastName:    eid.lastName,
        birthDate:   eid.birthDate,
        gender:      eid.gender,
        nationality: eid.nationality,
        street:      eid.street,
        zip:         eid.zip,
        city:        eid.city,
      };

      for (const [key, value] of Object.entries(scalarMap)) {
        if (value) {
          this.form.get(key)?.setValue(value);
          this.eidPrefilled.add(key);
        }
      }

      // Prénoms (FormArray) — on remplace le contrôle par défaut
      if (eid.firstNames?.length) {
        const arr = this.firstNames;
        // Vider le tableau
        while (arr.length) arr.removeAt(0);
        // Ajouter un contrôle par prénom
        eid.firstNames.forEach(name =>
          arr.push(this.fb.control(name, Validators.required))
        );
        this.eidPrefilled.add('firstNames');
      }
    } else {
      this.prefilledFromEid = false;
    }
  }

  // ── Accesseurs ────────────────────────────────────────────────────

  public get firstNames(): FormArray {
    return this.form.get('firstNames') as FormArray;
  }

  /** Vrai si le champ a été pré-rempli depuis la carte eID */
  public isFromEid(controlName: string): boolean {
    return this.eidPrefilled.has(controlName);
  }

  // ── Gestion prénoms ───────────────────────────────────────────────

  public addFirstName(): void {
    this.firstNames.push(this.fb.control('', Validators.required));
  }

  public removeFirstName(index: number): void {
    this.firstNames.removeAt(index);
  }

  public isFirstNameInvalid(index: number): boolean {
    const ctrl = this.firstNames.at(index);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  // ── Validation ────────────────────────────────────────────────────

  public isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  // ── Soumission ────────────────────────────────────────────────────

  public onSubmit(): void {
    this.form.markAllAsTouched();
    this.firstNames.controls.forEach(c => c.markAsTouched());

    if (this.form.invalid) return;

    this._loading.show();

    // TODO: remplacer par le vrai appel API
    // Le backend devra :
    //   1. Créer une [Personne] (sans Numéro de Registre National si saisie manuelle)
    //   2. Générer un identifiant SGP interne
    //   3. Créer le compte (rôle : Simple utilisateur)
    //   4. Envoyer l'e-mail de premier accès à form.value.email
    console.log('Payload:', this.form.value);
    console.log('Source données eID :', this.prefilledFromEid);

    setTimeout(() => {
      this.accountCreated = true;
      this._loading.hide();
      this._eidData.clear(); // nettoyage du service après création du compte
      this.cdr.detectChanges();
    }, 1500);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────

  ngOnDestroy(): void {
    // Sécurité : si l'utilisateur quitte sans soumettre, on purge quand même
    this._eidData.clear();
  }
}
