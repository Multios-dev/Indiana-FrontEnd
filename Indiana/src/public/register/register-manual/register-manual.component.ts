import { Component, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EidDataService } from '../../../services/eid-data.service';
import { KeyCloakService } from '../../../services/keycloak.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { KeyCloakUser } from '../../../models/keycloak/keycloak-user';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { take } from 'rxjs';



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
  // ── Validateur personnalisé pour la correspondance des mots de passe ─
  private static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  public accountCreated = false;
  public form!: FormGroup;
    public userForm: FormGroup = new FormGroup({});

  /** Indique que le formulaire a été pré-rempli via eID */
  public readonly prefilledFromEid!: boolean;

  /** Ensemble des noms de contrôles pré-remplis (pour les badges visuels) */
  public readonly eidPrefilled = new Set<string>();

  private _authService = inject(AuthService);
  private _eidData = inject(EidDataService);
  private _keycloakService = inject(KeyCloakService);
  private _loading = inject(NgxSpinnerService);
  private _router = inject(Router);
  private _toastService = inject(ToastService);
  private _translateService = inject(TranslateService);

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    // ── Initialisation of the empty formular ──────────────────────────
    this.form = this.fb.group({
      lastName:    ['', Validators.required],
      firstNames:  this.fb.array([
        this.fb.control('', Validators.required),
      ]),
      birthDate:   ['', Validators.required],
      gender:      ['', Validators.required],
      nationality: ['', Validators.required],
      street:      ['', Validators.required],
      streetNumber:['', Validators.required],
      zip:         ['', Validators.required],
      city:        ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      phone:       [''],
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
        nationality: eid.nationality,
        street:      eid.street,
        streetNumber:eid.streetNumber,
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

  // ── Accessors ────────────────────────────────────────────────────

  public get firstNames(): FormArray {
    return this.form.get('firstNames') as FormArray;
  }

  /** True if the field has been pre-filled from the eID card */
  public isFromEid(controlName: string): boolean {
    return this.eidPrefilled.has(controlName);
  }

  // ── Gestion names ───────────────────────────────────────────────

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

  // ── submit ────────────────────────────────────────────────────

  public onSubmit(): void {
    this.form.markAllAsTouched();
    this.firstNames.controls.forEach(c => c.markAsTouched());

    if (this.form.invalid) return;

    this._loading.show();

    const v = this.form.value;

    const keycloakUser: KeyCloakUser = {
      username:       v.email,
      email:          v.email,
      password:       v.password,
      first_name:     v.firstNames[0],
      last_name:      v.lastName,
      email_verified: false,
      is_admin:       false,
    };

    // TODO: remplacer par le vrai groupId du rôle "Simple utilisateur"
    const GROUP_ID = 'TODO_GROUP_ID';

    this._keycloakService.createUser(keycloakUser, GROUP_ID).subscribe({
      next: (success) => {
        this._loading.hide();
        if (success) {
          this.accountCreated = true;
          this._eidData.clear();
          this.cdr.detectChanges();
        } else {
          this._toastService.showToast(
            'authToast',
            'La création du compte a échoué. Veuillez réessayer.',
            'error',
            'Erreur'
          );
        }
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

  public signup() {
  this._loading.show();
  const userSignup = this.userForm.getRawValue();
  
  this._keycloakService.createUser(userSignup, "TODO voir pour le group_id")
                   .pipe(take(1))
                   .subscribe({
                    next: () => {
                      this._authService.setLoggedIn();
                      this._loading.hide();
                    },
                    error: () => {
                      this._toastService.showToast('authToast', this._translateService.instant('SIGNUP.ERRORMESSAGE.SERVERERROR'), 'error', this._translateService.instant('ERROR'))
                      this._loading.hide();
                    }
                   });
}
  // ── Lifecycle ─────────────────────────────────────────────────────

  ngOnDestroy(): void {
    // Sécurité : si l'utilisateur quitte sans soumettre, on purge quand même
    this._eidData.clear();
  }
}