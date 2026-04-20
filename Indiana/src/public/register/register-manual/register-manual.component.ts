import { Component, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EidDataService } from '../../../services/eid-data.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';
import { UserCreateInput } from '../../../models/user-create';

// Codes pays ISO 3166-1 alpha-2
const ISO_COUNTRIES = [
  { code: 'BE', label: 'Belgique / Belgïe / Belgien' },
  { code: 'FR', label: 'France' },
  { code: 'NL', label: 'Pays-Bas / Nederland' },
  { code: 'DE', label: 'Allemagne / Deutschland' },
  { code: 'AT', label: 'Autriche / Österreich' },
  { code: 'CH', label: 'Suisse / Schweiz / Svizzera' },
  { code: 'LU', label: 'Luxembourg' },
  { code: 'GB', label: 'Royaume-Uni / United Kingdom' },
  { code: 'IE', label: 'Irlande / Ireland' },
  { code: 'ES', label: 'Espagne / España' },
  { code: 'IT', label: 'Italie / Italia' },
  { code: 'PT', label: 'Portugal' },
  { code: 'GR', label: 'Grèce' },
  { code: 'PL', label: 'Pologne / Polska' },
  { code: 'CZ', label: 'République Tchèque / Česko' },
  { code: 'SK', label: 'Slovaquie / Slovensko' },
  { code: 'HU', label: 'Hongrie / Magyarország' },
  { code: 'RO', label: 'Roumanie / România' },
  { code: 'BG', label: 'Bulgarie' },
  { code: 'HR', label: 'Croatie / Hrvatska' },
  { code: 'SI', label: 'Slovénie / Slovenija' },
  { code: 'SE', label: 'Suède / Sverige' },
  { code: 'NO', label: 'Norvège / Norge' },
  { code: 'DK', label: 'Danemark / Danmark' },
  { code: 'FI', label: 'Finlande / Suomi' },
];

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
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
  // ── Codes pays ISO 3166-1 alpha-2 ───────────────────────────
  public readonly isoCountries = ISO_COUNTRIES;

  // ── Validateur personnalisé pour la correspondance des 2 mots de passe ─
  private static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // ── Validateur personnalisé pour le numéro de téléphone ─
  private static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phone = control.value;
    if (!phone) return null;

    const phoneRegex = /^\+?[0-9]{8,15}$/;
    return phoneRegex.test(phone) ? null : { invalidPhone: true };
  }

  // ── Validateur pour la date de naissance (pas dans le futur) ─
  private static birthDateValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = control.value;
    if (!birthDate) return null;

    const date = new Date(birthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date <= today ? null : { invalidBirthDate: true };
  }

  public accountCreated = false;
  public form!: FormGroup;

  /** Indique que le formulaire a été pré-rempli via eID */
  public readonly prefilledFromEid!: boolean;

  /** Ensemble des noms de contrôles pré-remplis (pour les badges visuels) */
  public readonly eidPrefilled = new Set<string>();

  private _authService = inject(AuthService);
  private _eidData = inject(EidDataService);
  private _userService = inject(UserService);
  private _loading = inject(NgxSpinnerService);
  private _router = inject(Router);
  private _toastService = inject(ToastService);
  private _translateService = inject(TranslateService);

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    // ── Initialisation of the empty formular ──────────────────────────
    this.form = this.fb.group({
      lastName:    [''],
      firstNames:  this.fb.array([
        this.fb.control('', Validators.required),
      ]),
      birthDate:   ['', RegisterManualComponent.birthDateValidator],
      gender:      [''],
      totem:       [''],
      quali:       [''],
      isLegalGuardian: [false],
      // ── Nationalités (au moins 1) ──
      nationalities:  this.fb.array([
        this.fb.control('', Validators.required),
      ]),
      // ── Contact ──
      email:       ['', [Validators.email]],
      phone:       ['', RegisterManualComponent.phoneValidator],
      // ── Home Address ──
      homeBoxNumber:   ['', Validators.required],
      homeStreet:      ['', Validators.required],
      homePostName:    ['', Validators.required],
      homePostCode:    ['', Validators.required],
      homeCountry:     ['', Validators.required],
      // ── Residential Address (optional) ──
      hasResidentialAddress: [false],
      residBoxNumber:   [''],
      residStreet:      [''],
      residPostName:    [''],
      residPostCode:    [''],
      residCountry:     [''],
      // ── Auth ──
      password:    ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: RegisterManualComponent.passwordMatchValidator });

    // ── Pré-remplissage depuis eID si des données sont disponibles ─
    const eid = this._eidData.getData();
    if (eid) {
      this.prefilledFromEid = true;

      // Champs scalaires
      const scalarMap: Record<string, string> = {
        lastName:    eid.lastName,
        birthDate:   eid.birthDate,
        gender:      eid.gender,
        homeStreet:  eid.street,
        homePostCode: eid.zip,
        homePostName: eid.city,
      };

      for (const [key, value] of Object.entries(scalarMap)) {
        if (value) {
          this.form.get(key)?.setValue(value);
          this.eidPrefilled.add(key);
        }
      }

      // Nationalité depuis eID (peut être un seul pays)
      if (eid.nationality) {
        const arr = this.nationalities;
        arr.at(0)?.setValue(eid.nationality);
        this.eidPrefilled.add('nationalities');
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

    // Setup listener pour les adresses résidentielles
    this.form.get('hasResidentialAddress')?.valueChanges.subscribe(hasResidential => {
      const residentialFields = ['residBoxNumber', 'residStreet', 'residPostName', 'residPostCode', 'residCountry'];
      residentialFields.forEach(field => {
        const control = this.form.get(field);
        if (hasResidential) {
          control?.setValidators([Validators.required]);
        } else {
          control?.clearValidators();
        }
        control?.updateValueAndValidity({ emitEvent: false });
      });
    });
  }

  // ── Accessors ────────────────────────────────────────────────────

  public get firstNames(): FormArray {
    return this.form.get('firstNames') as FormArray;
  }

  public get nationalities(): FormArray {
    return this.form.get('nationalities') as FormArray;
  }

  /** True if the field has been pre-filled from the eID card */
  public isFromEid(controlName: string): boolean {
    return this.eidPrefilled.has(controlName);
  }

  // ── Gestion prénoms ────────────────────────────────────────────

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

  // ── Gestion nationalités ───────────────────────────────────────

  public addNationality(): void {
    this.nationalities.push(this.fb.control('', Validators.required));
  }

  public removeNationality(index: number): void {
    this.nationalities.removeAt(index);
  }

  public isNationalityInvalid(index: number): boolean {
    const ctrl = this.nationalities.at(index);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  // ── Validation ────────────────────────────────────────────────────

  public isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  // ── submit ────────────────────────────────────────────────────

  public onSubmit(): void {
    this.form.markAllAsTouched();
    this.firstNames.controls.forEach(c => c.markAsTouched());
    this.nationalities.controls.forEach(c => c.markAsTouched());

    if (this.form.invalid) return;

    this._loading.show();

    const val = this.form.value;
    const birthDate = val.birthDate
      ? new Date(val.birthDate).toISOString().split('T')[0]
      : null;

    // Créer l'utilisateur via le backend avec son mot de passe
    this._userService.createUser(
      {
        first_names: val.firstNames,
        last_name: val.lastName || null,
        birth_date: birthDate,
        gender: val.gender || null,
        nationality: val.nationalities,
        totem: val.totem || null,
        quali: val.quali || null,
        is_legal_guardian: val.isLegalGuardian || false,
        contact: {
          email: val.email || null,
          phone: val.phone || null,
        },
        home_address: {
          box_number: val.homeBoxNumber,
          thoroughfare: val.homeStreet,
          post_name: val.homePostName,
          post_code: val.homePostCode,
          country: val.homeCountry,
        },
        residential_address: val.hasResidentialAddress
          ? {
              box_number: val.residBoxNumber,
              thoroughfare: val.residStreet,
              post_name: val.residPostName,
              post_code: val.residPostCode,
              country: val.residCountry,
            }
          : undefined,
      },
      val.password
    ).subscribe({
      next: () => {
        this._loading.hide();
        this.accountCreated = true;
        this._eidData.clear();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this._loading.hide();
        console.error('Erreur création compte:', err);
        const message = err.status === 409
          ? 'Un compte avec cet e-mail existe déjà.'
          : 'Une erreur est survenue. Veuillez réessayer.';
        this._toastService.showToast('authToast', message, 'error', 'Erreur');
      },
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────

  ngOnDestroy(): void {
    // Sécurité : si l'utilisateur quitte sans soumettre, on purge quand même
    this._eidData.clear();
  }
}